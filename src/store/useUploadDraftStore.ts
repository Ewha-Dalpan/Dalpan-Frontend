// 접수 대기 중인 대화 캡처 (관계 + 사진)
// 톨이 부족해서 톨 부족 창 → 충전 화면을 오가는 동안 올린 사진을 기억함
// 평소에는 메모리에만 두고, PayApp 결제창에 다녀오는 동안만 브라우저에 보관함 (uploadDraftStorage)

import { create } from 'zustand'
import type { Photo } from '../components/PhotoUploadBox'
import type { CaseRelation } from '../types/case'
import { deleteStoredDraft } from '../utils/uploadDraftStorage'

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
  clearDraft: () => {
    void deleteStoredDraft()
    set({ draft: null })
  },
}))
