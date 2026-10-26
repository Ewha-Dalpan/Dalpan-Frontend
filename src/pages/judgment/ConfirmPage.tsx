// AI 재판 - AI 상황확인 페이지 (2.1.2)
// 헤더는 JudgmentLayout에서!
// AI가 정리한 상황을 보여주고, 사용자가 상황 · 말풍선 방향을 고친 뒤 판결을 요청

import { useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCase, requestJudgment, updateSituation } from '../../apis/caseApi'
import swapIcon from '../../assets/judgment/swap.svg'
import Button from '../../components/Button'
import InlineEditField from '../../components/InlineEditField'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { useCaseStore } from '../../store/useCaseStore'
import type { Case, SpeakerSide } from '../../types/case'
import { getApiErrorMessage } from '../../utils/apiError'

function ConfirmPage() {
  const caseId = useCaseStore((state) => state.pendingCase?.caseId)

  // AI가 분석한 사건 (상황 요약 · 갈등 핵심 · 말풍선 방향)
  const { data: caseDetail, isError } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCase(caseId!),
    enabled: caseId !== undefined,
  })

  // 진행 중인 사건 없이 주소로 바로 들어오거나, 사건을 불러오지 못하면 홈으로
  if (caseId === undefined) return <Navigate to={paths.home} replace />
  if (isError) return <Navigate to={paths.home} replace state={{ toast: '사건 정보를 불러오지 못했어요.' }} />

  if (!caseDetail) {
    return (
      <p role="status" className="text-b2-regular px-6 pt-10 text-center text-gray-70">
        상황을 불러오는 중이에요
      </p>
    )
  }

  // 이미 판결 중인 사건이면 판결 로딩으로
  if (caseDetail.status === 'JUDGING') return <Navigate to={paths.judging} replace />
  // 아직 분석이 안 끝났으면(이어하기로 들어온 경우 등) 분석 대기 화면으로 돌아가서 기다림
  if (caseDetail.situation?.analysis_status !== 'DONE') return <Navigate to={paths.received} replace />

  // 불러온 값으로 입력칸 초기값을 채우려고 폼을 따로 분리
  return <ConfirmForm caseDetail={caseDetail} />
}

function ConfirmForm({ caseDetail }: { caseDetail: Case }) {
  const navigate = useNavigate()
  const setRequestId = useCaseStore((state) => state.setRequestId)
  const startJudging = useCaseStore((state) => state.startJudging)
  const { toast, showToast, hideToast } = useToast()

  const savedSummary = caseDetail.situation?.summary ?? ''
  const savedSide: SpeakerSide = caseDetail.situation?.user_speaker_side ?? 'RIGHT'

  // 기본은 오른쪽 말풍선 = 나 (user_speaker_side: RIGHT) / ⇄ 누르면 반대로
  const [isSwapped, setIsSwapped] = useState(savedSide === 'LEFT') // 화자 좌우 반전 여부
  const [situation, setSituation] = useState(savedSummary) // 상황 (수정 가능!!)

  const leftSpeaker = isSwapped ? '나' : '상대'
  const rightSpeaker = isSwapped ? '상대' : '나'

  // 상황을 전부 지우면 버튼 비활성화!!
  const canSubmit = situation.trim().length > 0

  // 고친 내용이 있으면 먼저 저장 → 판결 요청 (같은 분석으로 판결받는 건 톨이 추가로 빠지지 않음)
  const judgment = useMutation({
    mutationFn: async () => {
      const summary = situation.trim()
      const side: SpeakerSide = isSwapped ? 'LEFT' : 'RIGHT'
      if (summary !== savedSummary || side !== savedSide) {
        await updateSituation(caseDetail.id, { summary, user_speaker_side: side })
      }
      return requestJudgment(caseDetail.id)
    },
    onSuccess: (request) => {
      // 판결 진행 상태는 새 요청 ID로 조회 + 사건 단계도 판결 로딩으로 바꿔서, 나갔다 오면 로딩부터 이어서 함
      setRequestId(request.id)
      startJudging()
      navigate(paths.judging, { replace: true })
    },
    onError: (error) => showToast(getApiErrorMessage(error)),
  })

  // 빠르게 두 번 눌러도 요청은 한 번만
  const isSubmitting = useRef(false)
  const handleSubmit = () => {
    if (isSubmitting.current) return
    isSubmitting.current = true
    judgment.mutate(undefined, { onError: () => (isSubmitting.current = false) })
  }

  return (
    // 헤더를 뺀 화면 높이를 채워서 CTA가 항상 맨 아래에 붙게 함
    <div className="flex min-h-[calc(100dvh-51px)] flex-col px-6 pt-3.5 pb-8.5">
      <h2 className="text-h2-semibold text-gray-90">제가 이해한 상황이 맞나요?</h2>
      <p className="text-b2-regular mt-2 text-gray-90">
        대화를 바탕으로 상황을 이렇게 정리했어요.
        <br />
        다른 부분만 가볍게 수정해주세요.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        {/* 화자 구분 */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-b2-regular text-gray-100">화자 구분</h3>
            <Button
              aria-label="말풍선 좌우 바꾸기"
              aria-pressed={isSwapped}
              onClick={() => setIsSwapped((prev) => !prev)}
              className="cursor-pointer"
            >
              <img src={swapIcon} alt="" className="block max-w-none" />
            </Button>
          </div>
          <ul className="text-b2-regular mt-2.25 flex gap-3 text-gray-100">
            <li className="flex items-center gap-2.25">
              <span className="size-5 rounded-[4.2px] bg-[#50ff9c]" />
              왼쪽 말풍선 = {leftSpeaker}
            </li>
            <li className="flex items-center gap-2.25">
              <span className="size-5 rounded-[4.2px] bg-[#53bdff]" />
              오른쪽 말풍선 = {rightSpeaker}
            </li>
          </ul>
        </section>

        <InlineEditField label="상황" value={situation} onChange={setSituation} />
        <InlineEditField label="이번 갈등 핵심은" value={caseDetail.conflict_core ?? ''} editable={false} />
      </div>

      {/* 판결받기 → AI 판결 로딩 */}
      <div className="mt-auto pt-6">
        <Button
          variant="primary"
          fullWidth
          disabled={!canSubmit || judgment.isPending}
          onClick={handleSubmit}
          className="h-10"
        >
          {judgment.isPending ? '판결을 요청하는 중...' : '이대로 판결받기'}
        </Button>
      </div>
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default ConfirmPage
