// AI 재판 페이지 배경이 크림색이라 크림색 페이지에만 적용시킨 레이아웃입니다!!

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { paths } from '../routes/paths'

function JudgmentLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // 상황확인은 이미 사건이 접수된 뒤라 뒤로가기 버튼 없음
  const showBack = pathname !== paths.confirm

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-bg-light text-gray-90">
      {/* 업로드는 뒤로가기 시 홈으로 */}
      <Header depth={2} theme="light" title="AI 재판" onBack={showBack ? () => navigate(paths.home) : undefined} />
      <main><Outlet /></main>
    </div>
  )
}

export default JudgmentLayout
