import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import GNB from '../components/GNB'
import type { GNBDestination, GNBTab } from '../components/GNB'
import Header from '../components/Header'
import { paths } from '../routes/paths'

const destinations: Record<GNBDestination, string> = {
  home: paths.home,
  jury: paths.jury,
  my: paths.my,
  'ai-trial': paths.upload,
}

function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isJuryExplore = pathname === paths.juryExplore
  const activeTab: GNBTab = pathname === paths.jury || isJuryExplore ? 'jury' : pathname === paths.my ? 'my' : 'home'

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[393px] bg-bg text-white-100">
      {isJuryExplore ? (
        <Header depth={2} title="사건 탐색" onBack={() => navigate(paths.jury)} />
      ) : (
        <Header depth={1} title={activeTab === 'home' ? 'dalpan' : activeTab} />
      )}
      <main className={activeTab === 'home' ? undefined : 'pb-[93px]'}>
        <Outlet />
      </main>
      {/* 하단 네비게이션 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[44.564453125px] mx-auto w-full max-w-[393px]">
        <div className="pointer-events-auto relative left-[calc(50%+0.41064453125px)] w-fit -translate-x-1/2">
          <GNB activeTab={activeTab} onNavigate={(destination) => {
            const target = destinations[destination]
            if (pathname !== target) navigate(target)
          }} />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
