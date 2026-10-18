// 로그아웃/회원 탈퇴 후 공통 정리: 토큰 삭제 → 저장된 서버 데이터 비우기 → 로그인 화면으로
// message를 넘기면 로그인 화면에 안내 문구로 보여줌

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import { useAuthStore } from '../store/useAuthStore'

export const useSignOut = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)

  return (message?: string) => {
    logout()
    queryClient.clear() // 이전 사용자의 내 정보/사건 목록 등이 남지 않게
    navigate(paths.login, { replace: true, state: message ? { message } : null })
  }
}
