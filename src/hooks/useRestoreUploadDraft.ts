// PayApp 결제창에서 돌아왔을 때, 이 주문을 결제하러 나가면서 보관한 사진을 다시 꺼내 둠
// 다 꺼내면 true (그 전에 접수 버튼을 누르면 사진 없이 업로드 화면으로 가버리기 때문)

import { useEffect, useState } from 'react'
import { useUploadDraftStore } from '../store/useUploadDraftStore'
import { loadStoredDraft } from '../utils/uploadDraftStorage'

export const useRestoreUploadDraft = (orderId: string | null) => {
  const [isReady, setIsReady] = useState(orderId === null)

  useEffect(() => {
    if (!orderId) return
    let cancelled = false
    void loadStoredDraft(orderId).then((stored) => {
      if (cancelled) return
      const { draft, setDraft } = useUploadDraftStore.getState()
      if (stored && !draft) {
        setDraft({
          relation: stored.relation,
          photos: stored.photos.map(({ id, file }) => ({ id, file, previewUrl: URL.createObjectURL(file) })),
        })
      }
      setIsReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [orderId])

  return isReady
}
