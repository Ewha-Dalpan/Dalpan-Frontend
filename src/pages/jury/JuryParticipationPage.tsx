import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import { exampleJuryCases } from './exampleJuryCases'
import JuryCaseContent from './JuryCaseContent'
import JuryBalance from './JuryBalance'

function Participation({ item }: { item: (typeof exampleJuryCases)[number] }) {
  const navigate = useNavigate()
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
          <Button disabled={!touched} onClick={() => navigate(paths.juryDetail(item.id), { state: { ratio } })}
            className="text-b2-semibold absolute left-[24px] top-[721px] z-30 flex h-[40px] w-[345px] items-center justify-center rounded-[8px] bg-keycolor-100 text-white-100 enabled:cursor-pointer disabled:bg-gray-10 disabled:text-gray-60">
            판결 제출하기
          </Button>
        </main>
      </div>
    </div>
  )
}

function JuryParticipationPage() {
  const { caseId } = useParams()
  const item = exampleJuryCases.find((entry) => String(entry.id) === caseId)
  if (!item) return <Navigate to={paths.juryExplore} replace />
  return <Participation key={item.id} item={item} />
}

export default JuryParticipationPage
