// 토스트 메시지 상태를 관리하는 커스텀 훅 (Toast 컴포넌트와 같이 사용)
// const { toast, showToast, hideToast } = useToast()
// <Toast toast={toast} onHide={hideToast} />

import { useCallback, useState } from 'react'

export type ToastState = { id: number; message: string } | null

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>(null)

  // 같은 문구를 연달아 띄워도 다시 나타나도록 매번 새 id 부여
  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), [])
  const hideToast = useCallback(() => setToast(null), [])

  return { toast, showToast, hideToast }
}
