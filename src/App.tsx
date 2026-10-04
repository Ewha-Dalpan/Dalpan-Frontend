import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import JudgmentLayout from './layouts/JudgmentLayout'
import HomePage from './pages/home/HomePage'
import UploadPage from './pages/judgment/UploadPage'
import ConfirmPage from './pages/judgment/ConfirmPage'
import JuryPage from './pages/jury/JuryPage'
import JuryExplorePage from './pages/jury/JuryExplorePage'
import MyPage from './pages/my/MyPage'
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
        </Route>
        <Route element={<JudgmentLayout />}>
          <Route path={paths.upload} element={<UploadPage />} />
          <Route path={paths.confirm} element={<ConfirmPage />} />
        </Route>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
