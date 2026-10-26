import { useCallback, useMemo, useRef, useState } from 'react'
import { matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom'
import GNB from '../components/GNB'
import type { GNBTab } from '../components/GNB'
import Header from '../components/Header'
import PendingCaseModals from '../components/modal/PendingCaseModals'
import Toast from '../components/Toast'
import { paths } from '../routes/paths'
import { getCases } from '../apis/caseApi'
import type { Case } from '../types/case'
import { useToast } from '../hooks/useToast'
import { getApiErrorMessage } from '../utils/apiError'

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
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()
  const [pendingCase, setPendingCase] = useState<Case | null>(null)
  const checking = useRef(false)
  const { toast: startToast, showToast, hideToast: hideStartToast } = useToast()
  const isJuryExplore = pathname === paths.juryExplore
  const isMyCases = pathname === paths.myCases
  const isMyJuryActivity = pathname === paths.myJuryActivity
  const isMyCaseDetail = Boolean(matchPath(paths.myCaseDetailPattern, pathname))
  const isMyDetail = isMyCases || isMyCaseDetail || isMyJuryActivity
  const isDetail = isJuryExplore || isMyDetail
  const activeTab: GNBTab = pathname === paths.jury || isJuryExplore ? 'jury' : pathname === paths.my || isMyDetail ? 'my' : 'home'

  // 다른 화면에서 이동하며 넘겨준 토스트 
  const toastMessage = (location.state as { toast?: string } | null)?.toast
  const toast = useMemo(() => (toastMessage ? { id: location.key, message: toastMessage } : null), [toastMessage, location.key])
  // 토스트가 사라지면 넘겨받은 state도 지워서, 새로고침/뒤로가기 때 다시 뜨지 않게 함
  const hideToast = useCallback(() => navigate(pathname, { replace: true, state: null }), [navigate, pathname])

  // AI 재판 시작 (홈 CTA, GNB 망치): 확인 중인 사건이 있으면 이어서 할지 먼저 물어봄
  const startJudgment = async () => {
    if (checking.current) return
    checking.current = true
    try {
      const result = await getCases({ unfinished: true })
      if (result.results.length) setPendingCase(result.results[0])
      else navigate(paths.upload)
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      checking.current = false
    }
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
      {pendingCase && <PendingCaseModals item={pendingCase} onClose={() => setPendingCase(null)} />}
      <Toast toast={startToast} onHide={hideStartToast} />
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default MainLayout
