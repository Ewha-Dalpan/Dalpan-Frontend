// 사건 전역 상태: 접수는 했지만 아직 판결이 안 끝난 사건을 기억
// 화면을 나갔다가 다시 들어와도 이어서 할 수 있게 localStorage에 저장

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 사건이 어디까지 진행됐는지: AI 상황확인 중 / AI 판결 로딩 중
export type CaseStage = 'confirm' | 'judging'

interface PendingCase {
  caseId: number // 서버 사건 ID
  requestId: number // 분석 · 판결 진행 상태를 조회할 요청 ID
  receivedAt: number // 사건 접수 시각 (ms)
  stage: CaseStage
}

interface CaseState {
  pendingCase: PendingCase | null
  receiveCase: (ids: { caseId: number; requestId: number }) => void
  setRequestId: (requestId: number) => void // 다시 접수/판결 요청으로 새 요청이 생겼을 때
  startJudging: () => void
  clearPendingCase: () => void
}

// TODO: 이어하기 모달까지 연동되면 서버의 진행 중 사건(unfinished)으로 교체
export const useCaseStore = create<CaseState>()(
  persist(
    (set) => ({
      pendingCase: null,
      receiveCase: ({ caseId, requestId }) =>
        set({ pendingCase: { caseId, requestId, receivedAt: Date.now(), stage: 'confirm' } }),
      setRequestId: (requestId) =>
        set((state) => (state.pendingCase ? { pendingCase: { ...state.pendingCase, requestId } } : state)),
      startJudging: () =>
        set((state) => (state.pendingCase ? { pendingCase: { ...state.pendingCase, stage: 'judging' } } : state)),
      clearPendingCase: () => set({ pendingCase: null }),
    }),
    {
      name: 'dalpan-pending-case',
      // version 2부터 서버 사건 ID를 저장함
      // 이전 버전에 저장된 사건은 서버 ID가 없어서 이어할 수 없으므로 지움
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) return { pendingCase: null }
        return persisted as { pendingCase: PendingCase | null }
      },
    },
  ),
)
