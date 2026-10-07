import { useState } from 'react'
import { matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom'
import GNB from '../components/GNB'
import type { GNBTab } from '../components/GNB'
import Header from '../components/Header'
import PendingCaseModals from '../components/PendingCaseModals'
import { paths } from '../routes/paths'
import { useCaseStore } from '../store/useCaseStore'

// 하위 페이지(홈)에서 useOutletContext로 꺼내 쓰는 값
export type MainLayoutContext = {
  startJudgment: () => void
}

const destinations: Record<GNBTab, string> = {
  home: paths.home,
  jury: paths.jury,
  my: paths.my,
}

function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const hasPendingCase = useCaseStore((state) => state.pendingCase !== null)
  const [isPendingCaseModalOpen, setIsPendingCaseModalOpen] = useState(false)
  const isJuryExplore = pathname === paths.juryExplore
  const isMyCases = pathname === paths.myCases
  const isMyJuryActivity = pathname === paths.myJuryActivity
  const isMyCaseDetail = Boolean(matchPath(paths.myCaseDetailPattern, pathname))
  const isMyDetail = isMyCases || isMyCaseDetail || isMyJuryActivity
  const isDetail = isJuryExplore || isMyDetail
  const activeTab: GNBTab = pathname === paths.jury || isJuryExplore ? 'jury' : pathname === paths.my || isMyDetail ? 'my' : 'home'

  // AI 재판 시작 (홈 CTA, GNB 망치): 확인 중인 사건이 있으면 이어서 할지 먼저 물어봄
  const startJudgment = () => {
    if (hasPendingCase) setIsPendingCaseModalOpen(true)
    else navigate(paths.upload)
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[393px] bg-bg text-white-100">
      {isDetail ? (
        <Header depth={2} title={isMyJuryActivity ? '배심 활동' : isMyDetail ? '내 사건' : '배심원석'} onBack={() => navigate(isMyCaseDetail ? paths.myCases : isMyDetail ? paths.my : paths.jury)} />
      ) : (
        <Header depth={1} title={activeTab === 'home' ? 'dalpan' : activeTab} />
      )}
      <main className={isMyCaseDetail ? undefined : isDetail ? 'pb-[24px]' : activeTab === 'home' ? undefined : 'pb-[93px]'}>
        <Outlet context={{ startJudgment } satisfies MainLayoutContext} />
      </main>
      {/* 하단 네비게이션 */}
      {!isDetail && <div className="pointer-events-none fixed inset-x-0 bottom-[44.564453125px] mx-auto w-full max-w-[393px]">
        <div className="pointer-events-auto relative left-[calc(50%+0.41064453125px)] w-fit -translate-x-1/2">
          <GNB activeTab={activeTab} onNavigate={(destination) => {
            if (destination === 'ai-trial') return startJudgment()
            const target = destinations[destination]
            if (pathname !== target) navigate(target)
          }} />
        </div>
      </div>}
      <PendingCaseModals open={isPendingCaseModalOpen} onClose={() => setIsPendingCaseModalOpen(false)} />
    </div>
  )
}

export default MainLayout
