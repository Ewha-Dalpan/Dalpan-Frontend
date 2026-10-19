// AI 재판 - 사건접수 로딩 페이지 (분석 대기)
// 업로드 → 이 화면 (AI가 대화를 분석하는 동안 진행 상태를 반복 조회) → 분석이 끝나면 AI 상황확인으로 자동 이동
// 모션넣음!! 토끼가 달 뒤에서 튀어 올라옴 → 귀 쫑긋, 달 회전, 별 반짝, 문구 떠오름

import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCasePayment, submitCase } from '../../apis/caseApi'
import { getVerdictRequest } from '../../apis/verdictApi'
import Modal from '../../components/modal/Modal'
import { useCaseStore } from '../../store/useCaseStore'
import { getApiErrorMessage } from '../../utils/apiError'
import chair from '../../assets/judgment/received/chair.svg'
import desk from '../../assets/judgment/received/desk.svg'
import moon from '../../assets/judgment/received/moon.svg'
import moonCraters from '../../assets/judgment/received/moon-craters.svg'
import rabbitBody from '../../assets/judgment/received/rabbit-body.svg'
import rabbitCheeks from '../../assets/judgment/received/rabbit-cheeks.svg'
import rabbitEarLeft from '../../assets/judgment/received/rabbit-ear-left.svg'
import rabbitEarRight from '../../assets/judgment/received/rabbit-ear-right.svg'
import rabbitFace from '../../assets/judgment/received/rabbit-face.svg'
import rabbitGlasses from '../../assets/judgment/received/rabbit-glasses.svg'
import rabbitHands from '../../assets/judgment/received/rabbit-hands.svg'
import rabbitNose from '../../assets/judgment/received/rabbit-nose.svg'
import { paths } from '../../routes/paths'

// 분석이 빨리 끝나도 토끼 모션은 끝까지 보이게 최소로 보여주는 시간 (ms)
const MIN_SHOW_MS = 3000

// 분석 진행 상태를 다시 조회하는 간격 (ms)
const POLL_MS = 2000

// 밤하늘 별 위치/크기(px)/반짝이는 시작 시간(s)
const STARS = [
  { left: 48, top: 96, size: 3, delay: 0 },
  { left: 330, top: 120, size: 4, delay: 0.6 },
  { left: 200, top: 70, size: 2, delay: 0.9 },
  { left: 84, top: 250, size: 3, delay: 1.1 },
  { left: 300, top: 270, size: 3, delay: 0.3 },
  { left: 30, top: 340, size: 2, delay: 0.5 },
  { left: 352, top: 330, size: 2, delay: 1.4 },
]

function CaseReceivedPage() {
  const navigate = useNavigate()
  const pendingCase = useCaseStore((state) => state.pendingCase)
  const setRequestId = useCaseStore((state) => state.setRequestId)
  const clearPendingCase = useCaseStore((state) => state.clearPendingCase)
  const [hasShownMinimum, setHasShownMinimum] = useState(false)
  // 처음 들어왔을 때 진행 중인 사건이 있었는지 (중간에 사건을 지워도 아래 이동 처리가 덮어써지지 않게 기억)
  const [hadPendingCase] = useState(pendingCase !== null)

  // 최소 시간이 지났는지
  useEffect(() => {
    const timer = setTimeout(() => setHasShownMinimum(true), MIN_SHOW_MS)
    return () => clearTimeout(timer)
  }, [])

  // 분석 진행 상태: 분석이 끝나거나(확인 대기) 실패할 때까지 2초마다 다시 조회
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

  // 분석이 끝나면 AI 상황확인으로 (replace: 뒤로가기로 이 화면에 다시 안 오게!)
  // 이미 판결까지 끝난 사건이면 판결문으로
  useEffect(() => {
    if (!hasShownMinimum || !request) return
    if (request.status === 'AWAITING_CONFIRMATION') navigate(paths.confirm, { replace: true })
    if (request.status === 'DONE') navigate(paths.verdict(request.case_id), { replace: true })
  }, [hasShownMinimum, request, navigate])

  // 요청을 찾을 수 없으면(삭제된 사건 등) 홈으로
  useEffect(() => {
    if (!isError) return
    clearPendingCase()
    navigate(paths.home, { replace: true, state: { toast: '사건 정보를 불러오지 못했어요.' } })
  }, [isError, clearPendingCase, navigate])

  // 실패하면 다시 접수할 때 드는 톨 (진행 · 확인 대기 요청이 있으면 0)
  const caseId = pendingCase?.caseId
  const { data: payment } = useQuery({
    queryKey: ['casePayment', caseId],
    queryFn: () => getCasePayment(caseId!),
    enabled: isFailed && caseId !== undefined,
  })

  // 같은 사건으로 다시 분석 접수 → 새 요청 ID로 다시 조회 시작
  const isResubmitting = useRef(false) // 빠르게 두 번 눌러서 톨이 두 번 빠지지 않게
  const resubmit = useMutation({
    mutationFn: () => submitCase(caseId!),
    onSuccess: (newRequest) => setRequestId(newRequest.id),
    onSettled: () => (isResubmitting.current = false),
  })

  const handleResubmit = () => {
    if (isResubmitting.current) return
    isResubmitting.current = true
    resubmit.mutate()
  }

  const handleGoHome = () => {
    clearPendingCase()
    navigate(paths.home, { replace: true })
  }

  // 진행 중인 사건 없이 주소로 바로 들어오면 홈으로
  if (!hadPendingCase) return <Navigate to={paths.home} replace />

  return (
    <div className="relative mx-auto h-dvh w-full max-w-98.25 overflow-hidden bg-bg">
      <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-98.25 -translate-x-1/2">
        {/* 별 */}
        {STARS.map((star) => (
          <span
            key={`${star.left}-${star.top}`}
            className="absolute rounded-full bg-white-100 motion-safe:animate-[twinkle_1.8s_ease-in-out_infinite]"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}

        {/* 의자 + 책상 (제자리에 그대로! 토끼만 움직여용) */}
        <div className="absolute top-50 left-28 h-[192.5px] w-42.5">
          <img src={chair} alt="" className="absolute top-33.25 left-7.25 block max-w-none" />
          <img src={desk} alt="" className="absolute top-42.25 left-0 block max-w-none" />

          {/* 토끼 영역: 아래쪽은 책상 윗선(손 끝)에서 잘라서 책상 뒤에서 올라오는 것처럼 보임 */}
          <div className="absolute -top-10 -left-10 h-52.75 w-62.5 overflow-hidden">
            {/* 토끼만 아래에서 뿅 올라옴 */}
            <div className="absolute top-10 left-10 h-[192.5px] w-42.5 motion-safe:animate-[rabbit-rise_800ms_cubic-bezier(0.34,1.2,0.64,1)_200ms_both]">
              <img src={rabbitBody} alt="" className="absolute top-[138.74px] left-[30.75px] block max-w-none" />
              <img src={rabbitHands} alt="" className="absolute top-[159.51px] left-[63.7px] block max-w-none" />
              {/* 귀는 아래쪽 뿌리를 축으로 흔들림 */}
              <img
                src={rabbitEarRight}
                alt=""
                className="absolute top-[7.37px] left-[75.44px] block max-w-none origin-[20%_95%] motion-safe:animate-[ear-wiggle-right_1.6s_ease-in-out_1.1s_infinite]"
              />
              <img
                src={rabbitEarLeft}
                alt=""
                className="absolute top-0 left-[33.06px] block max-w-none origin-[80%_95%] motion-safe:animate-[ear-wiggle-left_1.6s_ease-in-out_1s_infinite]"
              />
              <img src={rabbitFace} alt="" className="absolute top-[60.66px] left-6.25 block max-w-none" />
              <img src={rabbitNose} alt="" className="absolute top-[109.7px] left-[80.55px] block max-w-none" />
              <img src={rabbitCheeks} alt="" className="absolute top-[112.76px] left-[41.47px] block max-w-none" />
              <img src={rabbitGlasses} alt="" className="absolute top-[93.61px] left-[48.37px] block max-w-none" />
            </div>
          </div>
        </div>

        {/* 달 (의자,책상보다 뒤에 적어서 책상 아랫부분을 덮음) */}
        <div className="absolute top-97 -left-142.75 size-383.75">
          <img src={moon} alt="" className="absolute inset-0 block max-w-none" />
          <img
            src={moonCraters}
            alt=""
            className="absolute inset-0 block max-w-none motion-safe:animate-[moon-spin_120s_linear_infinite]"
          />
        </div>
      </div>

      {/* 사건 접수 완료 문구 + 분석이 오래 걸려서 기다려 달라는 안내 (조금 늦게 떠오름) */}
      <div role="status" className="absolute inset-x-0 top-107.75 text-center">
        <p className="text-h2-semibold text-black motion-safe:animate-[fade-up_600ms_ease-out_900ms_both]">
          달토끼에게
          <br />
          사건이 접수됐어요.
        </p>
        <p className="text-b3-regular mt-2 text-gray-70 motion-safe:animate-[fade-up_600ms_ease-out_1300ms_both]">
          조금만 기다려주세요...
        </p>
      </div>

      {/* 분석 실패 (디자인이 없어서 공통 모달 사용) */}
      <Modal
        open={isFailed && !resubmit.isPending}
        title="대화를 분석하지 못했어요"
        description={
          <>
            {resubmit.isError ? getApiErrorMessage(resubmit.error) : (request?.error_message ?? '잠시 후 다시 시도해 주세요.')}
            {payment && (
              <>
                <br />
                <span className="text-keycolor-100">
                  {payment.cost > 0 ? `다시 접수하면 ${payment.cost}톨이 차감돼요.` : '다시 접수해도 톨은 차감되지 않아요.'}
                </span>
              </>
            )}
          </>
        }
        cancelText="홈으로"
        confirmText="다시 접수하기"
        wideConfirm
        onCancel={handleGoHome}
        onDismiss={() => {}} // 바깥을 눌러도 닫히지 않게 (둘 중 하나를 골라야 함)
        onConfirm={handleResubmit}
      />
    </div>
  )
}

export default CaseReceivedPage
