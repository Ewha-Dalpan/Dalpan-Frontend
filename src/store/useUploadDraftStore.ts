// 접수 대기 중인 대화 캡처 (관계 + 사진)
// 톨이 부족해서 톨 부족 창 → 충전 → 결제 완료 화면을 오가는 동안 올린 사진을 기억했다가, 결제 후 그대로 접수함
// 사진 파일은 저장소(localStorage)에 넣을 수 없어서 메모리에만 둠 

import { create } from 'zustand'
import type { Photo } from '../components/PhotoUploadBox'
import type { CaseRelation } from '../types/case'

export type UploadDraft = {
  relation: CaseRelation
  photos: Photo[]
}

interface UploadDraftState {
  draft: UploadDraft | null
  setDraft: (draft: UploadDraft) => void
  clearDraft: () => void
}

export const useUploadDraftStore = create<UploadDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}))
