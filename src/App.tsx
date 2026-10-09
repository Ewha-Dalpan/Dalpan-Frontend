import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import JudgmentLayout from './layouts/JudgmentLayout'
import HomePage from './pages/home/HomePage'
import UploadPage from './pages/judgment/UploadPage'
import ConfirmPage from './pages/judgment/ConfirmPage'
import CaseReceivedPage from './pages/judgment/CaseReceivedPage'
import JudgingPage from './pages/judgment/JudgingPage'
import VerdictPage from './pages/judgment/VerdictPage'
import VerdictResultPage from './pages/judgment/VerdictResultPage'
import VerdictReasonPage from './pages/judgment/VerdictReasonPage'
import JuryPage from './pages/jury/JuryPage'
import JuryExplorePage from './pages/jury/JuryExplorePage'
import MyPage from './pages/my/MyPage'
import MyJuryActivityPage from './pages/my/MyJuryActivityPage'
import MyCasesPage from './pages/my/MyCasesPage'
import MyCaseDetailPage from './pages/my/MyCaseDetailPage'
import LoginPage from './pages/onboarding/LoginPage'
import { paths } from './routes/paths'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.jury} element={<JuryPage />} />
          <Route path={paths.juryExplore} element={<JuryExplorePage />} />
          <Route path={paths.my} element={<MyPage />} />
          <Route path={paths.myJuryActivity} element={<MyJuryActivityPage />} />
          <Route path={paths.myCases} element={<MyCasesPage />} />
          <Route path={paths.myCaseDetailPattern} element={<MyCaseDetailPage />} />
        </Route>
        <Route element={<JudgmentLayout />}>
          <Route path={paths.upload} element={<UploadPage />} />
          <Route path={paths.confirm} element={<ConfirmPage />} />
        </Route>
        {/* 사건접수 로딩은 헤더 없는 전체 화면, AI 판결 로딩·판결문은 남색 배경이라 크림색 레이아웃 밖에 둠 */}
        <Route path={paths.received} element={<CaseReceivedPage />} />
        <Route path={paths.judging} element={<JudgingPage />} />
        <Route path={paths.verdict} element={<VerdictPage />} />
        <Route path={paths.verdictResult} element={<VerdictResultPage />} />
        {/* 판단 근거 상세: 판결문 전체 화면 / 내 사건 상세 두 곳에서 같은 페이지로 (자체 헤더라 레이아웃 밖) */}
        <Route path={paths.verdictReason} element={<VerdictReasonPage />} />
        <Route path={paths.myCaseReasonPattern} element={<VerdictReasonPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
