// 로그인 상태를 확인하는 커스텀 훅

import { useUserStore } from '../store/useUserStore'

export const useAuth = () => {
  const user = useUserStore((state) => state.user)
  return { user, isLoggedIn: user !== null }
}
