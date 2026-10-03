import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { paths } from '../routes/paths'

function JudgmentLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[393px] bg-bg text-white-100">
      <Header depth={2} title="AI 재판" onBack={() => navigate(pathname === paths.confirm ? paths.upload : paths.home)} />
      <main><Outlet /></main>
    </div>
  )
}

export default JudgmentLayout
