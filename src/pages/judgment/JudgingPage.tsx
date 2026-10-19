// AI 재판 - AI 판결 로딩 페이지
// 상황확인 → 이 화면 (판결 진행 상태를 반복 조회, 진행 단계에 맞춰 문구가 바뀜) → 판결이 끝나면 판결문으로

import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCasePayment, requestJudgment } from '../../apis/caseApi'
import { getVerdictRequest } from '../../apis/verdictApi'
import loadingRabbit from '../../assets/judgment/loading.mp4'
import Header from '../../components/Header'
import Modal from '../../components/modal/Modal'
import { paths } from '../../routes/paths'
import { useCaseStore } from '../../store/useCaseStore'
import type { ProgressStep } from '../../types/verdict'
import { getApiErrorMessage } from '../../utils/apiError'

// 단계별 문구 (판결 진행 단계에 맞춰 순서대로 바뀜)
const STEPS = [
  { title: '달토끼가 판결을 찧고 있어요', description: ['대화 속 말과 맥락을 하나씩 살펴보며', '판결을 만들고 있어요.'] },
  { title: '대화의 재료를 살펴보고 있어요', description: ['누가 어떤 말을 했는지 확인 중...'] },
  { title: '말 사이의 맥락을 찧어보고 있어요', description: ['관계와 대화의 흐름을 파악 중...'] },
  { title: '엇갈린 지점을 골라내고 있어요', description: ['갈등이 시작된 핵심 장면을 분석 중...'] },
  { title: '판결을 마지막으로 빚고 있어요', description: ['과실 비율과 판단 근거를 정리 중...'] },
]

// 백엔드 진행 단계 → 보여줄 문구 번호 (없는 단계는 첫 문구)
const STEP_INDEX: Partial<Record<ProgressStep, number>> = {
  PLANNING_FACTORS: 1, // 판단 요소 구성
  SEARCHING_SCHOLAR: 2, // 논문 검색
  REVIEWING_SOURCES: 2, // 참고 출처 검토
  SEARCHING_WEB: 3, // 기사 검색
  GENERATING_JUDGMENT: 4, // 판결 생성
  DONE: 4,
}

// 문구 하나를 최소로 보여주는 시간 (ms)
const STEP_MIN_MS = 2000

// 판결이 빨리 끝나도 문구를 읽을 수 있게 최소로 보여주는 시간 (ms)
const MIN_SHOW_MS = 3000

// 판결 진행 상태를 다시 조회하는 간격 (ms)
const POLL_MS = 2000

function JudgingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pendingCase = useCaseStore((state) => state.pendingCase)
  const setRequestId = useCaseStore((state) => state.setRequestId)
  const clearPendingCase = useCaseStore((state) => state.clearPendingCase)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false) // 판결 로딩 나가기 모달
  const [hasShownMinimum, setHasShownMinimum] = useState(false)
  // 처음 들어왔을 때 진행 중인 사건이 있었는지 (판결이 끝나 사건을 지워도 아래 이동 처리가 덮어써지지 않게 기억)
  const [hadPendingCase] = useState(pendingCase !== null)

  useEffect(() => {
    const timer = setTimeout(() => setHasShownMinimum(true), MIN_SHOW_MS)
    return () => clearTimeout(timer)
  }, [])

  // 판결 진행 상태: 판결이 끝나거나 실패할 때까지 2초마다 다시 조회
  const caseId = pendingCase?.caseId
  const requestId = pendingCase?.requestId
  const { data: request, isError } = useQuery({
    queryKey: ['verdictRequest', requestId],
    queryFn: () => getVerdictRequest(requestId!),
    enabled: requestId !== undefined,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'PENDING' || status === 'RUNNING' || status === undefined ? POLL_MS : false
    },
  })

  const isFailed = request?.status === 'FAILED' || request?.status === 'CANCELED'

  const progressStep = request?.progress_step
  const targetStep = progressStep ? (STEP_INDEX[progressStep] ?? 0) : 0
  const [shownStep, setShownStep] = useState(0)

  const canAdvance = shownStep < targetStep
  useEffect(() => {
    if (!canAdvance) return
    const timer = setTimeout(() => setShownStep((step) => step + 1), STEP_MIN_MS)
    return () => clearTimeout(timer)
  }, [shownStep, canAdvance])

  // 판결이 끝나면 판결문 도착 화면으로 (replace: 뒤로가기로 로딩에 다시 안 오게!)
  // 나가기 모달이 떠 있는 동안은 기다림
  useEffect(() => {
    if (!hasShownMinimum || isLeaveModalOpen || !request) return
    if (request.status === 'DONE' && caseId !== undefined) {
      // 받은 판결문을 넣어둬서 판결문 화면에서 다시 요청하지 않고 바로 보여줌
      if (request.verdict) queryClient.setQueryData(['verdict', caseId], request.verdict)
      clearPendingCase() // 판결이 끝났으니 '확인 중인 사건'에서 지움
      navigate(paths.verdict(caseId), { replace: true })
    }
    // 아직 상황 확인 전 요청이면(이어하기 등) 상황확인으로
    if (request.status === 'AWAITING_CONFIRMATION') navigate(paths.confirm, { replace: true })
  }, [hasShownMinimum, isLeaveModalOpen, request, caseId, queryClient, clearPendingCase, navigate])

  // 요청을 찾을 수 없으면(삭제된 사건 등) 홈으로
  useEffect(() => {
    if (!isError) return
    clearPendingCase()
    navigate(paths.home, { replace: true, state: { toast: '사건 정보를 불러오지 못했어요.' } })
  }, [isError, clearPendingCase, navigate])

  // 실패하면 다시 요청할 때 드는 톨 (확인 대기 · 진행 중 요청이 있으면 0)
  const { data: payment } = useQuery({
    queryKey: ['casePayment', caseId],
    queryFn: () => getCasePayment(caseId!),
    enabled: isFailed && caseId !== undefined,
  })

  // 같은 사건으로 판결 다시 요청 → 새 요청 ID로 다시 조회 시작
  const isRetrying = useRef(false) // 빠르게 두 번 눌러서 톨이 두 번 빠지지 않게
  const retry = useMutation({
    mutationFn: () => requestJudgment(caseId!),
    onSuccess: (newRequest) => setRequestId(newRequest.id),
    onSettled: () => (isRetrying.current = false),
  })

  const handleRetry = () => {
    if (isRetrying.current) return
    isRetrying.current = true
    retry.mutate()
  }

  const handleGoHome = () => {
    clearPendingCase()
    navigate(paths.home, { replace: true })
  }

  // 진행 중인 사건 없이 주소로 바로 들어오면 홈으로
  if (!hadPendingCase) return <Navigate to={paths.home} replace />

  const { title, description } = STEPS[shownStep]

  return (
    <div className="mx-auto flex h-dvh w-full max-w-98.25 flex-col bg-bg text-white-100">
      {/* 이미 판결이 진행 중이라 바로 나가지 않고 모달로 한 번 더 확인 */}
      <Header depth={2} title="AI 재판" onBack={() => setIsLeaveModalOpen(true)} />

      <main className="flex flex-1 flex-col items-center justify-center pb-21">
        {/* 망치 찧는 토끼~ */}
        <video
          src={loadingRabbit}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          width={656}
          height={390}
          className="block h-auto w-63 [clip-path:inset(0_0_1px_0)]"
        />

        {/* 문구가 바뀔 때마다 다시 아래에서 부드럽게 올라옴 (제목 → 설명 순서) */}
        <div role="status" className="mt-4.5 text-center">
          <div key={title}>
            <h1 className="text-h2-semibold motion-safe:animate-[fade-up_500ms_ease-out_both]">{title}</h1>
            {/* 설명이 1줄인 단계에서도 2줄 높이를 확보해서, 문구가 바뀔 때 토끼가 위아래로 안 움직이게 함 */}
            <p className="text-b2-regular mt-2 min-h-11.25 text-gray-30 motion-safe:animate-[fade-up_500ms_ease-out_120ms_both]">
              {description.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </main>

      {/* 계속하기 → 로딩 그대로 / 나가기 → 홈 (사건은 저장돼서 홈에서 이어서 할 수 있음) */}
      <Modal
        open={isLeaveModalOpen}
        title="판결 화면을 나갈까요?"
        description={
          <>
            사건은 저장되어 다음에 이어서 확인할 수 있어요.
            <br />
            사용한 1톨은 반환되지 않아요.
          </>
        }
        cancelText="계속하기"
        confirmText="나가기"
        onCancel={() => setIsLeaveModalOpen(false)}
        onConfirm={() => navigate(paths.home)}
      />

      {/* 판결 실패 (디자인이 없어서 공통 모달 사용) */}
      <Modal
        open={isFailed && !retry.isPending && !isLeaveModalOpen}
        title="판결을 만들지 못했어요"
        description={
          <>
            {retry.isError ? getApiErrorMessage(retry.error) : (request?.error_message ?? '잠시 후 다시 시도해 주세요.')}
            {payment && (
              <>
                <br />
                <span className="text-keycolor-100">
                  {payment.cost > 0 ? `다시 요청하면 ${payment.cost}톨이 차감돼요.` : '다시 요청해도 톨은 차감되지 않아요.'}
                </span>
              </>
            )}
          </>
        }
        cancelText="홈으로"
        confirmText="다시 요청하기"
        wideConfirm
        onCancel={handleGoHome}
        onDismiss={() => {}} // 바깥을 눌러도 닫히지 않게 (둘 중 하나를 골라야 함)
        onConfirm={handleRetry}
      />
    </div>
  )
}

export default JudgingPage
