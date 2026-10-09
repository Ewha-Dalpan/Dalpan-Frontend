// 사건 전역 상태: 접수는 했지만 아직 판결이 안 끝난 사건을 기억
// 화면을 나갔다가 다시 들어와도 이어서 할 수 있게 localStorage에 저장

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 사건이 어디까지 진행됐는지: AI 상황확인 중 / AI 판결 로딩 중
export type CaseStage = 'confirm' | 'judging'

interface PendingCase {
  receivedAt: number // 사건 접수 시각 (ms)
  stage: CaseStage
}

interface CaseState {
  pendingCase: PendingCase | null
  receiveCase: () => void
  startJudging: () => void
  clearPendingCase: () => void
}

// TODO: API 연동 시 서버의 진행 중 사건으로 교체
export const useCaseStore = create<CaseState>()(
  persist(
    (set) => ({
      pendingCase: null,
      receiveCase: () => set({ pendingCase: { receivedAt: Date.now(), stage: 'confirm' } }),
      startJudging: () =>
        set((state) => (state.pendingCase ? { pendingCase: { ...state.pendingCase, stage: 'judging' } } : state)),
      clearPendingCase: () => set({ pendingCase: null }),
    }),
    {
      name: 'dalpan-pending-case',
      // version 0에는 stage가 없어서 상황확인 중으로 채움
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as { pendingCase: Omit<PendingCase, 'stage'> | null }
        if (version === 0 && state.pendingCase) return { pendingCase: { ...state.pendingCase, stage: 'confirm' } }
        return state
      },
    },
  ),
)
