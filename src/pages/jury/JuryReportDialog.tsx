import { useId, useRef, useState } from 'react'
import Modal from '../../components/modal/Modal'
import selectedIcon from '../../assets/jury/report/radio-selected.svg'
import emptyIcon from '../../assets/jury/report/radio-empty.svg'
import { reportJuryCase, reportJuryComment } from '../../apis/juryApi'
import type { ReportReason } from '../../types/jury'
import { getApiErrorMessage, isApiStatus } from '../../utils/apiError'

const reasons: { value: ReportReason; label: string }[] = [
  { value: 'ABUSE', label: '욕설 및 비방' },
  { value: 'PRIVACY', label: '개인정보 노출' },
  { value: 'SPAM', label: '스팸 및 광고' },
  { value: 'OTHER', label: '기타' },
]

export default function JuryReportDialog({ caseId, commentId, onClose, onComplete }: {
  caseId: number
  commentId?: number
  onClose: () => void
  onComplete: (message: string) => void
}) {
  const name = useId()
  const [reason, setReason] = useState<ReportReason>('ABUSE')
  const [detail, setDetail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const valid = reason !== null && (reason !== 'OTHER' || detail.trim().length > 0) && detail.trim().length <= 500
  const dismiss = () => { if (!pending.current) onClose() }
  const submit = async () => {
    if (!reason || !valid || pending.current) return
    pending.current = true
    setBusy(true)
    setError('')
    try {
      const body = { reason, detail: reason === 'OTHER' ? detail.trim() : '' }
      if (commentId !== undefined) await reportJuryComment(caseId, commentId, body)
      else await reportJuryCase(caseId, body)
      onComplete('신고가 접수됐어요.')
    } catch (cause) {
      if (isApiStatus(cause, 409)) onComplete('이미 신고한 대상이에요.')
      else setError(isApiStatus(cause, 401) ? '로그인이 필요해요. 다시 로그인해 주세요.' : isApiStatus(cause, 404) ? '신고할 대상을 찾을 수 없어요.' : getApiErrorMessage(cause))
    } finally { pending.current = false; setBusy(false) }
  }
  return <Modal open layout="report" title="신고 사유를 선택해 주세요." cancelText="취소" confirmText={busy ? '접수 중…' : '신고하기'}
    confirmDisabled={!valid || busy} cancelDisabled={busy} onCancel={dismiss} onConfirm={() => void submit()}>
    <fieldset disabled={busy} aria-label="신고 사유" className="absolute left-[23px] right-[27px] top-[56px] flex flex-col gap-[8px] text-left text-b2-regular text-gray-70">
      {reasons.map((entry) => <div key={entry.value} className={`flex items-center gap-[4px] ${entry.value === 'OTHER' && reason === 'OTHER' ? 'h-[30px]' : 'h-[23px]'}`}>
        <label className="flex shrink-0 cursor-pointer items-center gap-[4px]">
          <span className="relative block size-[18px] shrink-0">
            <input type="radio" name={name} value={entry.value} checked={reason === entry.value} onChange={() => { setReason(entry.value); setError('') }} className="peer sr-only" />
            <img src={reason === entry.value ? selectedIcon : emptyIcon} alt="" className="block max-w-none peer-focus-visible:outline-2 peer-focus-visible:outline-keycolor-100" />
          </span>
          <span className={entry.value === 'OTHER' ? 'w-[26px]' : undefined}>{entry.label}</span>
        </label>
        {entry.value === 'OTHER' && reason === 'OTHER' && <input aria-label="기타 신고 사유" value={detail} maxLength={500} required disabled={busy}
          onChange={(event) => { setDetail(event.target.value); setError('') }}
          className="h-[30px] w-[244px] min-w-0 rounded-[4px] bg-white-100 px-[10px] py-[4px] text-b3-regular text-gray-60 placeholder:text-gray-20 focus-visible:outline-1 focus-visible:outline-keycolor-40"
          placeholder="어떤 문제가 있었는지 자세히 알려주세요." />}
      </div>)}
    </fieldset>
    {error && <p role="alert" className="absolute inset-x-0 top-[254px] rounded-[8px] bg-gray-5 p-3 text-b2-regular text-keycolor-100">{error}</p>}
  </Modal>
}
