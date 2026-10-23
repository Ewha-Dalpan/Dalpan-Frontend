import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import closeIcon from '../assets/header/close.svg'

export default function ImageViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = previousOverflow }
  }, [])
  return createPortal(<dialog ref={dialog} aria-label={alt} onCancel={(event) => { event.preventDefault(); onClose() }}
    className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black text-white-100 backdrop:bg-black">
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 justify-end px-4 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
        <Button autoFocus aria-label="전체 이미지 닫기" onClick={onClose} className="flex size-11 items-center justify-center rounded-[8px] focus-visible:outline-2 focus-visible:outline-white">
          <img src={closeIcon} alt="" className="block" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
        {failed ? <p role="alert" className="p-6 text-center">이미지를 불러오지 못했어요.</p> :
          <img src={src} alt={alt} onError={() => setFailed(true)} className="mx-auto block h-auto w-full max-w-[800px]" />}
      </div>
    </div>
  </dialog>, document.body)
}
