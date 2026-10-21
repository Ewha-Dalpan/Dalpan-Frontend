// 결제 - 결제 완료 (2.2.2)
// Paddle 결제창에서 결제를 마치면 이 화면 → '보유 이용권을 활용해 접수하기'
// 업로드에서 톨이 부족해서 들어왔으면 올려둔 사진으로 바로 접수, 마이에서 충전하러 왔으면 업로드 화면으로

import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import TollIcon from '../../components/TollIcon'
import Toast from '../../components/Toast'
import { TOLL_PER_CASE, useCoinBalance } from '../../hooks/useCoinBalance'
import { useSubmitCase } from '../../hooks/useSubmitCase'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { useUploadDraftStore } from '../../store/useUploadDraftStore'

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

function PaymentCompletePage() {
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

      <Button variant="primary" fullWidth disabled={isPending} onClick={handleSubmit} className="mt-auto h-10">
        {isPending ? '접수하는 중...' : '보유 이용권을 활용해 접수하기'}
      </Button>
      <Toast toast={toast} onHide={hideToast} />
    </main>
  )
}

export default PaymentCompletePage
