import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import closeIcon from '../assets/header/close.svg'

function ViewerImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <p role="alert" className="p-6 text-center">이미지를 불러오지 못했어요.</p> :
    <img src={src} alt={alt} onError={() => setFailed(true)} draggable={false} className="mx-auto block h-auto w-full max-w-[800px]" />
}

export default function ImageViewer({ images, initialIndex, onClose }: { images: string[]; initialIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  useEffect(() => {
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element?.showModal()
    const viewport = gallery.current
    if (viewport) viewport.scrollLeft = initialIndex * viewport.clientWidth
    document.body.style.overflow = 'hidden'
    return () => { element?.close(); document.body.style.overflow = previousOverflow }
  }, [initialIndex])
  return createPortal(<dialog ref={dialog} aria-label="대화 캡처 전체 보기" onCancel={(event) => { event.preventDefault(); onClose() }}
    className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black text-white-100 backdrop:bg-black">
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
        <span aria-live="polite" className="text-sm">{currentIndex + 1} / {images.length}</span>
        <Button autoFocus aria-label="전체 이미지 닫기" onClick={onClose} className="flex size-11 items-center justify-center rounded-[8px] focus-visible:outline-2 focus-visible:outline-white">
          <img src={closeIcon} alt="" className="block" />
        </Button>
      </div>
      <div ref={gallery} tabIndex={0} aria-label="좌우로 넘겨서 이미지 보기"
        onScroll={(event) => {
          const element = event.currentTarget
          if (element.clientWidth) setCurrentIndex(Math.max(0, Math.min(images.length - 1, Math.round(element.scrollLeft / element.clientWidth))))
        }}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          const element = event.currentTarget
          const nextIndex = Math.max(0, Math.min(images.length - 1, currentIndex + (event.key === 'ArrowRight' ? 1 : -1)))
          element.scrollTo({ left: nextIndex * element.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        }}
        className="scrollbar-none flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        {images.map((src, index) => <div key={`${src}-${index}`} className="h-full w-full shrink-0 snap-center snap-always overflow-y-auto overscroll-y-contain pb-[env(safe-area-inset-bottom)]">
          <ViewerImage src={src} alt={`대화 캡처 ${index + 1} 전체 이미지`} />
        </div>)}
      </div>
    </div>
  </dialog>, document.body)
}
