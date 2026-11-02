// 결제 - 결제 결과 (/payments/result?order_id=...)
// PayApp 결제창에서 돌아오면 이 화면. 도착했다고 완료가 아니라, 주문 상태가 PAID일 때만 완료로 보여줌
// 완료 → '보유 이용권을 활용해 접수하기': 결제 전에 올려둔 사진이 있으면 바로 접수, 없으면 업로드 화면으로

import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getOrder } from '../../apis/paymentApi'
import Button from '../../components/Button'
import TollIcon from '../../components/TollIcon'
import Toast from '../../components/Toast'
import { TOLL_PER_CASE, useCoinBalance } from '../../hooks/useCoinBalance'
import { useRestoreUploadDraft } from '../../hooks/useRestoreUploadDraft'
import { useSubmitCase } from '../../hooks/useSubmitCase'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { useUploadDraftStore } from '../../store/useUploadDraftStore'
import { isApiStatus } from '../../utils/apiError'
import { OPERATOR } from '../policy/operator'

// PENDING일 때 다시 조회하는 간격, 자동 조회를 멈추는 시간 (ms)
const ORDER_POLL_MS = 3000
const ORDER_TIMEOUT_MS = 120000

const CHECKING = { title: '결제를 확인하고 있어요', description: '잠시만 기다려 주세요.', canRecheck: false }

function TollRow({ label, amount, highlight }: { label: string; amount: number | undefined; highlight?: boolean }) {
  return (
    <div
      className={`flex h-14 items-center justify-between rounded-lg bg-white-100 px-4 ${highlight ? 'border border-keycolor-100 shadow-[0_0_20px_rgba(251,178,178,0.2)]' : ''}`}
    >
      <span className="text-b2-medium text-gray-100">{label}</span>
      <span className="text-b2-semibold flex items-center gap-1.25 text-gray-100">
        <TollIcon />
        {amount === undefined ? '-' : `${amount}톨`}
      </span>
    </div>
  )
}

// 결제 완료
function PaidView({ isDraftReady }: { isDraftReady: boolean }) {
  const navigate = useNavigate()
  const draft = useUploadDraftStore((state) => state.draft)
  const { data: balance } = useCoinBalance()
  const { toast, showToast, hideToast } = useToast()
  const { submit, isPending } = useSubmitCase({ onError: showToast })

  const handleSubmit = () => {
    if (draft) submit(draft)
    else navigate(paths.upload, { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-keycolor-5 px-6 pt-16.75 pb-10">
      <h1 role="status" className="text-h2-semibold">
        <span className="block text-keycolor-100">결제가 완료됐어요!</span>
        <span className="block text-gray-90">이용권을 사용해 판결을 받아보세요</span>
      </h1>

      <div className="mt-[61px] flex flex-col gap-3.75">
        <TollRow label="보유 이용권" amount={balance} highlight />
        <TollRow label="필요 이용권" amount={TOLL_PER_CASE} />
      </div>

      <Button variant="primary" fullWidth disabled={isPending || !isDraftReady} onClick={handleSubmit} className="mt-auto h-10">
        {isPending ? '접수하는 중...' : '보유 이용권을 활용해 접수하기'}
      </Button>
      <Toast toast={toast} onHide={hideToast} />
    </main>
  )
}

function PaymentResultPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const isDraftReady = useRestoreUploadDraft(orderId)

  const [timedOut, setTimedOut] = useState(false) // 오래 PENDING이라 자동 조회를 멈췄는지
  const [checkRun, setCheckRun] = useState(0) // '다시 확인'을 누를 때마다 제한 시간을 새로 셈

  const { data: order, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId!),
    enabled: orderId !== null,
    // 조회가 끝날 때마다 다음 조회를 다시 예약함 (PENDING은 실패가 아니라 아직 확인 전)
    refetchInterval: (query) => (!timedOut && query.state.data?.status === 'PENDING' ? ORDER_POLL_MS : false),
  })
  const status = order?.status

  useEffect(() => {
    if (!orderId || (status && status !== 'PENDING')) return
    const timer = setTimeout(() => setTimedOut(true), ORDER_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [orderId, status, checkRun])

  // 결제가 확인되면 보유 톨, 내 정보를 다시 불러옴 (잔액을 직접 계산하지 않음)
  useEffect(() => {
    if (status !== 'PAID') return
    void queryClient.invalidateQueries({ queryKey: ['coinBalance'] })
    void queryClient.invalidateQueries({ queryKey: ['me'] })
  }, [status, queryClient])

  if (status === 'PAID') return <PaidView isDraftReady={isDraftReady} />

  const recheck = () => {
    setTimedOut(false)
    setCheckRun((run) => run + 1)
    void refetch()
  }

  // 상태별 안내 (canRecheck: '다시 확인' 버튼을 보여줄지)
  const getView = () => {
    if (!orderId) return { title: '주문을 확인할 수 없어요', description: '주문 번호가 없어서 결제 결과를 불러오지 못했어요.', canRecheck: false }
    if (status === 'CANCELLED') return { title: '결제 요청이 취소됐어요', description: '다시 결제하려면 이용권 충전 화면으로 돌아가 주세요.', canRecheck: true }
    if (status === 'REFUNDED') return { title: '전액 취소된 주문이에요', description: '결제 금액이 전액 취소 처리됐어요.', canRecheck: false }
    if (status === 'EXPIRED') return { title: '주문이 만료됐어요', description: `이미 결제했다면 확인이 늦어지는 중일 수 있어요. 계속 같은 화면이 보이면 ${OPERATOR.email}로 문의해 주세요.`, canRecheck: true }
    if (status === 'PENDING') {
      if (!timedOut) return CHECKING
      return { title: '결제 확인이 늦어지고 있어요', description: `가상계좌는 입금 전까지 대기 상태일 수 있어요. 잠시 후 다시 확인하고, 계속 같으면 ${OPERATOR.email}로 문의해 주세요.`, canRecheck: true }
    }
    if (isError && isApiStatus(error, 404)) return { title: '주문을 찾을 수 없어요', description: '결제한 계정으로 로그인했는지 확인해 주세요.', canRecheck: false }
    if (isError) return { title: '결제 상태를 확인하지 못했어요', description: '결제가 실패했다는 뜻은 아니에요. 잠시 후 다시 확인해 주세요.', canRecheck: true }
    return CHECKING
  }
  const view = getView()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-keycolor-5 px-6 pt-16.75 pb-10">
      <div role="status">
        <h1 className="text-h2-semibold text-keycolor-100">{view.title}</h1>
        <p className="text-b2-regular mt-3 text-gray-70">{view.description}</p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {view.canRecheck && (
          <Button variant="primary" fullWidth disabled={isFetching} onClick={recheck} className="h-10">
            {isFetching ? '확인하는 중...' : '다시 확인하기'}
          </Button>
        )}
        <Button variant="white" fullWidth onClick={() => navigate(paths.tollCharge, { replace: true })}>
          이용권 충전으로 돌아가기
        </Button>
      </div>
    </main>
  )
}

export default PaymentResultPage
