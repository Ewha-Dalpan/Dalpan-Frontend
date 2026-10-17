// 로그인 상태를 확인하는 커스텀 훅

import { useAuthStore } from '../store/useAuthStore'

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const nickname = useAuthStore((state) => state.nickname)
  return { nickname, isLoggedIn: accessToken !== null }
}
