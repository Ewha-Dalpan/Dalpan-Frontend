// 사용자 전역 상태: 로그인한 사용자 정보를 저장하고 변경

import { create } from 'zustand'

interface User {
  id: number
  nickname: string
}

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
