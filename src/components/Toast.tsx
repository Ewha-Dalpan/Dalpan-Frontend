// 공통 토스트 메시지!! 

import { useEffect } from 'react'
import type { ToastState } from '../hooks/useToast'

type ToastProps = {
  toast: ToastState
  onHide: () => void
  duration?: number // 보여주는 시간 (ms)
}

function Toast({ toast, onHide, duration = 2000 }: ToastProps) {
  // 새 토스트가 뜰 때마다 타이머 다시 시작
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onHide, duration)
    return () => clearTimeout(timer)
  }, [toast, onHide, duration])

  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
      {toast && (
        <p key={toast.id} className="text-b3-medium rounded-lg bg-keycolor-100 px-4 py-2.5 text-white-100 motion-safe:animate-[fade-up_300ms_ease-out_both]">
          {toast.message}
        </p>
      )}
    </div>
  )
}

export default Toast
