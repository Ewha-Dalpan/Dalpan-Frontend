// 로그인 전역 상태: 토큰과 닉네임을 저장
// 새로고침해도 로그인이 유지되도록 localStorage에 저장

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null // API 요청에 붙이는 토큰 (30분)
  refreshToken: string | null // access 토큰이 만료되면 새로 받을 때 쓰는 토큰 (14일)
  nickname: string | null
  login: (tokens: { access: string; refresh: string; nickname: string }) => void
  setAccessToken: (access: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      nickname: null,
      login: ({ access, refresh, nickname }) => set({ accessToken: access, refreshToken: refresh, nickname }),
      setAccessToken: (access) => set({ accessToken: access }),
      logout: () => set({ accessToken: null, refreshToken: null, nickname: null }),
    }),
    { name: 'dalpan-auth' },
  ),
)
