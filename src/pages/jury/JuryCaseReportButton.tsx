import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JuryActionMenu from './JuryActionMenu'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'
import { useAuthStore } from '../../store/useAuthStore'
import { paths } from '../../routes/paths'
import JuryReportDialog from './JuryReportDialog'

export default function JuryCaseReportButton({ caseId, isAuthor }: { caseId: number; isAuthor: boolean }) {
  const [open, setOpen] = useState(false)
  const loggedIn = useAuthStore((state) => Boolean(state.accessToken))
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast()
  if (isAuthor) return null
  return <>
    <div className="absolute right-[19px] top-[14px] z-40"><JuryActionMenu label="사건 메뉴" actionLabel="신고" onAction={() => loggedIn ? setOpen(true) : navigate(paths.login)} /></div>
    {open && <JuryReportDialog caseId={caseId} onClose={() => setOpen(false)} onComplete={(message) => { setOpen(false); showToast(message) }} />}
    <Toast toast={toast} onHide={hideToast} />
  </>
}
