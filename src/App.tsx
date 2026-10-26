import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import JudgmentLayout from './layouts/JudgmentLayout'
import RequireAuth from './components/RequireAuth'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/home/HomePage'
import UploadPage from './pages/judgment/UploadPage'
import ConfirmPage from './pages/judgment/ConfirmPage'
import CaseReceivedPage from './pages/judgment/CaseReceivedPage'
import JudgingPage from './pages/judgment/JudgingPage'
import VerdictPage from './pages/judgment/VerdictPage'
import VerdictResultPage from './pages/judgment/VerdictResultPage'
import VerdictReasonPage from './pages/judgment/VerdictReasonPage'
import JuryRequestPage from './pages/judgment/JuryRequestPage'
import SharedVerdictPage from './pages/judgment/SharedVerdictPage'
import JuryParticipationPage from './pages/jury/JuryParticipationPage'
import JuryDetailPage from './pages/jury/JuryDetailPage'
import JuryPage from './pages/jury/JuryPage'
import JuryExplorePage from './pages/jury/JuryExplorePage'
import MyPage from './pages/my/MyPage'
import TicketHistoryPage from './pages/my/TicketHistoryPage'
import MyJuryActivityPage from './pages/my/MyJuryActivityPage'
import MyCasesPage from './pages/my/MyCasesPage'
import MyCaseDetailPage from './pages/my/MyCaseDetailPage'
import AccountPage from './pages/my/AccountPage'
import TollShortagePage from './pages/payment/TollShortagePage'
import TollChargePage from './pages/payment/TollChargePage'
import PaymentCompletePage from './pages/payment/PaymentCompletePage'
import LoginPage from './pages/onboarding/LoginPage'
import SignupPage from './pages/onboarding/SignupPage'
import KakaoCallbackPage from './pages/onboarding/KakaoCallbackPage'
import PricingPage from './pages/policy/PricingPage'
import PolicyPage from './pages/policy/PolicyPage'
import { PRIVACY_POLICY, REFUND_POLICY } from './pages/policy/policies'
import { PRIVACY_POLICY_EN, REFUND_POLICY_EN, TERMS_EN } from './pages/policy/policiesEn'
import { TERMS } from './pages/onboarding/terms'
import { paths } from './routes/paths'

function App() {
  return (
    <BrowserRouter>
      {/* 페이지가 바뀌면 항상 맨 위에서 시작 */}
      <ScrollToTop />
      <Routes>
        {/* 로그인한 사람만 볼 수 있는 화면 (로그인 안 했으면 로그인 화면부터) */}
        <Route element={<RequireAuth />}>
          <Route path={paths.myTicketHistory} element={<TicketHistoryPage />} />
          <Route element={<MainLayout />}>
            <Route path={paths.home} element={<HomePage />} />
            <Route path={paths.jury} element={<JuryPage />} />
            <Route path={paths.juryExplore} element={<JuryExplorePage />} />
            <Route path={paths.my} element={<MyPage />} />
            <Route path={paths.myJuryActivity} element={<MyJuryActivityPage />} />
            <Route path={paths.myCases} element={<MyCasesPage />} />
            <Route path={paths.myCaseDetailPattern} element={<MyCaseDetailPage />} />
          </Route>
          <Route path={paths.juryDetailPattern} element={<JuryDetailPage />} />
          <Route path={paths.juryParticipatePattern} element={<JuryParticipationPage />} />

          <Route element={<JudgmentLayout />}>
            <Route path={paths.upload} element={<UploadPage />} />
            <Route path={paths.confirm} element={<ConfirmPage />} />
          </Route>
          {/* 사건접수 로딩은 헤더 없는 전체 화면, AI 판결 로딩·판결문은 남색 배경이라 크림색 레이아웃 밖에 둠 */}
          <Route path={paths.received} element={<CaseReceivedPage />} />
          <Route path={paths.judging} element={<JudgingPage />} />
          <Route path={paths.verdictPattern} element={<VerdictPage />} />
          <Route path={paths.verdictResultPattern} element={<VerdictResultPage />} />
          {/* 판단 근거 상세: 판결문 전체 화면 / 내 사건 상세 두 곳에서 같은 페이지로 (자체 헤더라 레이아웃 밖) */}
          <Route path={paths.verdictReasonPattern} element={<VerdictReasonPage />} />
          <Route path={paths.myCaseReasonPattern} element={<VerdictReasonPage />} />
          <Route path={paths.juryRequestPattern} element={<JuryRequestPage />} />
          {/* 계정 관리 (자체 헤더, GNB 없음) */}
          <Route path={paths.myAccount} element={<AccountPage />} />
          {/* 결제: 톨 부족 → 톨 충전 → 결제 완료 (자체 헤더 · 배경) */}
          <Route path={paths.tollShortage} element={<TollShortagePage />} />
          <Route path={paths.tollCharge} element={<TollChargePage />} />
          <Route path={paths.paymentComplete} element={<PaymentCompletePage />} />
        </Route>

        {/* 공유 받은 사람이 링크로 들어오는 판결문 (헤더·GNB 없는 단독 화면, 로그인 불필요) */}
        <Route path={paths.sharedVerdictPattern} element={<SharedVerdictPage />} />
        {/* 공유 받은 사람도 판단 근거를 볼 수 있음 (같은 근거 페이지) */}
        <Route path={paths.sharedVerdictReasonPattern} element={<VerdictReasonPage />} />

        {/* 로그인 · 회원가입 */}
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.kakaoCallback} element={<KakaoCallbackPage />} />
        <Route path={paths.signup} element={<SignupPage />} />
        <Route path={paths.splash} element={<Navigate to={paths.login} replace />} />

        {/* 서비스 안내 · 정책 (로그인 불필요, Paddle 결제 심사용) */}
        <Route path={paths.pricing} element={<PricingPage />} />
        <Route path={paths.terms} element={<PolicyPage title="서비스 이용약관" sections={TERMS.terms.sections} switchTo={paths.termsEn} />} />
        <Route path={paths.refund} element={<PolicyPage title="환불 정책" sections={REFUND_POLICY} switchTo={paths.refundEn} />} />
        <Route path={paths.privacy} element={<PolicyPage title="개인정보처리방침" sections={PRIVACY_POLICY} switchTo={paths.privacyEn} />} />
        {/* 영문 버전 (Paddle 심사팀이 해외에 있어서) */}
        <Route path={paths.pricingEn} element={<PricingPage lang="en" />} />
        <Route path={paths.termsEn} element={<PolicyPage lang="en" title="Terms of Service" sections={TERMS_EN} switchTo={paths.terms} />} />
        <Route path={paths.refundEn} element={<PolicyPage lang="en" title="Refund Policy" sections={REFUND_POLICY_EN} switchTo={paths.refund} />} />
        <Route path={paths.privacyEn} element={<PolicyPage lang="en" title="Privacy Policy" sections={PRIVACY_POLICY_EN} switchTo={paths.privacy} />} />
        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
