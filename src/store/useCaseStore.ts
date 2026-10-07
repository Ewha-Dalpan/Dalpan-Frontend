// 사건 전역 상태: 접수는 했지만 아직 판결 전(AI 상황확인 중)인 사건을 기억
// 화면을 나갔다가 다시 들어와도 이어서 할 수 있게 localStorage에 저장

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PendingCase {
  receivedAt: number // 사건 접수 시각 (ms)
}

interface CaseState {
  pendingCase: PendingCase | null
  receiveCase: () => void
  clearPendingCase: () => void
}

// TODO: API 연동 시 서버의 진행 중 사건으로 교체
export const useCaseStore = create<CaseState>()(
  persist(
    (set) => ({
      pendingCase: null,
      receiveCase: () => set({ pendingCase: { receivedAt: Date.now() } }),
      clearPendingCase: () => set({ pendingCase: null }),
    }),
    { name: 'dalpan-pending-case' },
  ),
)
