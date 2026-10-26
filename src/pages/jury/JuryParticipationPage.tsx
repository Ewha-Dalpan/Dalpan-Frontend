import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import { useQueryClient } from '@tanstack/react-query'
import { voteJuryCase } from '../../apis/juryApi'
import type { JuryCaseDetail, JuryVoteRequest } from '../../types/jury'
import { getApiErrorMessage, isApiStatus } from '../../utils/apiError'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'
import { useJuryCase } from './useJuryCase'
import JuryCaseStatus from './JuryCaseStatus'
import JuryCaseContent from './JuryCaseContent'
import JuryBalance from './JuryBalance'

function Participation({ item, loggedIn }: { item: JuryCaseDetail; loggedIn: boolean }) {
  const navigate = useNavigate()
  const client = useQueryClient()
  const busy = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const submit = async () => {
    if (!loggedIn) { navigate(paths.login); return }
    if (!item.can_vote || !touched || busy.current) return
    busy.current = true
    setSubmitting(true)
    try {
      const result = await voteJuryCase(item.case_id, { fault_ratio: (100 - ratio) as JuryVoteRequest['fault_ratio'] })
      client.setQueryData(['juryCase', item.case_id, true], { ...item, ...result, can_vote: false, can_view_result: true })
      void client.invalidateQueries({ queryKey: ['juryCases'] })
      void client.invalidateQueries({ queryKey: ['featuredCases'] })
      void client.invalidateQueries({ queryKey: ['me'] })
      void client.invalidateQueries({ queryKey: ['myJuryActivities'] })
      void client.invalidateQueries({ queryKey: ['myJuryActivityCount'] })
      navigate(paths.juryDetail(item.case_id), { replace: true, state: { toast: result.coin_rewarded ? '판결을 제출했어요. 참여 보상 1톨이 지급됐어요.' : '판결을 제출했어요.' } })
    } catch (error) {
      showToast(getApiErrorMessage(error))
      if (isApiStatus(error, 409) || isApiStatus(error, 403)) void client.invalidateQueries({ queryKey: ['juryCase', item.case_id] })
    } finally { busy.current = false; setSubmitting(false) }
  }
  const goBack = useGoBack(paths.juryExplore)
  const [ratio, setRatio] = useState(50)
  const [touched, setTouched] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!touched) hintTimer.current = setTimeout(() => setShowHint(true), 2000)
    return () => { if (hintTimer.current) clearTimeout(hintTimer.current) }
  }, [touched])

  const resetHint = () => {
    if (hintTimer.current) clearTimeout(hintTimer.current)
    setShowHint(false)
    if (!touched) hintTimer.current = setTimeout(() => setShowHint(true), 2000)
  }

  return (
    <div className="relative mx-auto h-[max(770px,100dvh)] w-full max-w-[393px] overflow-clip bg-white-100 text-gray-90 @container"
      onPointerDown={resetHint} onKeyDown={resetHint}>
      <div className="absolute left-0 top-0 h-[804px] w-[393px] origin-top-left scale-[min(1,calc(100cqw/393px))]">
        <Header depth={2} title="배심원석" theme="white" onBack={goBack} />
        <main>
          <div className="absolute inset-x-0 top-[56px]"><JuryCaseContent item={item} /></div>
          <JuryBalance value={ratio} touched={touched} showHint={showHint} onChange={setRatio} onTouch={() => { setTouched(true); setShowHint(false) }} />
          <Button disabled={submitting || (loggedIn && (!touched || !item.can_vote))} onClick={() => void submit()}
            className="text-b2-semibold absolute left-[24px] top-[721px] z-30 flex h-[40px] w-[345px] items-center justify-center rounded-[8px] bg-keycolor-100 text-white-100 enabled:cursor-pointer disabled:bg-gray-10 disabled:text-gray-60">
            {submitting ? '제출 중…' : loggedIn ? '판결 제출하기' : '로그인하고 참여하기'}
          </Button>
        </main>
      </div>
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

function JuryParticipationPage() {
  const query = useJuryCase()
  if (!query.valid) return <Navigate to={paths.juryExplore} replace />
  if (!query.data) return <JuryCaseStatus error={query.error} retry={() => void query.refetch()} />
  if (query.data.can_view_result) return <Navigate to={paths.juryDetail(query.data.case_id)} replace />
  return <Participation key={query.data.case_id} item={query.data} loggedIn={query.loggedIn} />
}

export default JuryParticipationPage
