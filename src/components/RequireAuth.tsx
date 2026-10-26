// 로그인이 필요한 화면 보호: 로그인 안 했으면 로그인 화면으로 보내고, 로그인 후 원래 화면으로 돌아오게 함
// App.tsx에서 <Route element={<RequireAuth />}> 안에 보호할 화면을 넣어서 사용

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { paths } from '../routes/paths'

// 로그인 화면으로 넘기는 state 모양 (LoginPage에서 꺼내 씀)
export type LoginLocationState = { from?: string; message?: string } | null

function RequireAuth() {
  const { isLoggedIn } = useAuth()
  const { pathname, search } = useLocation()

  if (!isLoggedIn) {
    return <Navigate to={paths.login} replace state={{ from: pathname + search } satisfies LoginLocationState} />
  }
  return <Outlet />
}

export default RequireAuth
