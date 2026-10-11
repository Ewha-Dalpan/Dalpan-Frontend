// 토스트 메시지 상태를 관리하는 커스텀 훅 (Toast 컴포넌트와 같이 사용)
// const { toast, showToast, hideToast } = useToast()
// <Toast toast={toast} onHide={hideToast} />

import { useCallback, useState } from 'react'

// id: 바뀔 때마다 토스트가 새로 뜸
export type ToastState = { id: number | string; message: string } | null

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), [])
  const hideToast = useCallback(() => setToast(null), [])

  return { toast, showToast, hideToast }
}
