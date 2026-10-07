// 공통 확인 모달 (제목 + 설명 + 취소/확인 버튼)

import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import Button from './Button'

type ModalProps = {
  open: boolean
  title: string
  description?: ReactNode
  cancelText?: string
  confirmText?: string
  wideConfirm?: boolean // 확인 버튼을 더 넓게
  onCancel: () => void // 취소 버튼 (onDismiss가 없으면 Esc, 바깥 클릭 시에도)
  onDismiss?: () => void // Esc, 바깥 클릭 시 (취소 버튼과 다르게 동작해야 할 때만)
  onConfirm: () => void
}

function Modal({
  open,
  title,
  description,
  cancelText = '아니오',
  confirmText = '예',
  wideConfirm = false,
  onCancel,
  onDismiss = onCancel,
  onConfirm,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  // open 값에 맞춰 실제 dialog를 열고 닫음
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Esc를 누르면 브라우저가 바로 닫지 않고, 부모 state로 닫게 함
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
      // 어두운 바깥 영역(dialog 자기자신!)을 누르면 닫기
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss()
      }}
      className="m-auto w-[calc(100%-48px)] max-w-86.5 overflow-visible bg-transparent backdrop:bg-black/40 open:motion-safe:animate-[modal-slide-up_400ms_cubic-bezier(0.22,1,0.36,1)_both] backdrop:motion-safe:animate-[backdrop-fade-in_300ms_ease-out_both]"
    >
      <div className="rounded-lg bg-gray-5 px-3.75 pt-5.5 pb-4.25 text-center">
        <h2 id={titleId} className="text-h4-semibold text-gray-90">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="text-b2-regular mt-1 text-gray-70">
            {description}
          </p>
        )}
        <div className={`mt-3.5 grid ${wideConfirm ? 'grid-cols-[110fr_199fr] gap-2' : 'grid-cols-2 gap-1.25'}`}>
          <Button variant="white" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} className="h-10">
            {confirmText}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

export default Modal
