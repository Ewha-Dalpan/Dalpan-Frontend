// 공통 공유하기 모달 

import { useEffect, useRef } from 'react'
import facebookIcon from '../../assets/share/facebook.svg'
import instagramIcon from '../../assets/share/instagram.png'
import linkIcon from '../../assets/share/link.svg'
import messengerIcon from '../../assets/share/messenger.svg'
import xIcon from '../../assets/share/x.png'
import type { ShareTarget } from '../../utils/share'
import Button from '../Button'

const TARGETS: { id: ShareTarget; label: string; icon?: string; iconClassName?: string }[] = [
  { id: 'link', label: '링크 복사', icon: linkIcon },
  { id: 'instagram', label: '인스타그램', icon: instagramIcon, iconClassName: 'size-9' },
  { id: 'messenger', label: '메신저', icon: messengerIcon },
  { id: 'facebook', label: '페이스북', icon: facebookIcon },
  { id: 'x', label: 'X', icon: xIcon, iconClassName: 'size-10' },
  { id: 'more', label: '더보기' },
]

type ShareSheetProps = {
  open: boolean
  onClose: () => void // Esc, 바깥 클릭 시
  onSelect: (target: ShareTarget) => void
}

function ShareSheet({ open, onClose, onSelect }: ShareSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label="공유하기"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="mx-auto mt-auto mb-0 w-full max-w-98.25 rounded-t-[20px] bg-white-100 backdrop:bg-black/40 open:motion-safe:animate-[sheet-slide-up_350ms_cubic-bezier(0.22,1,0.36,1)_both] backdrop:motion-safe:animate-[backdrop-fade-in_300ms_ease-out_both]"
    >
      {/* 손잡이 모양 (장식) */}
      <div aria-hidden="true" className="mx-auto mt-4 h-1.25 w-18.75 rounded-full bg-gray-10" />

      <ul className="mx-auto mt-10 mb-11 grid w-fit grid-cols-4 gap-x-8.25 gap-y-4.25">
        {TARGETS.map((target) => (
          <li key={target.id} className="w-13.75">
            <Button onClick={() => onSelect(target.id)} className="flex w-full cursor-pointer flex-col items-center gap-0.5">
              <span className="flex size-13.75 items-center justify-center rounded-full bg-[#efefef]">
                {target.icon ? (
                  <img src={target.icon} alt="" className={`block max-w-none ${target.iconClassName ?? ''}`} />
                ) : (
                  <span aria-hidden="true" className="text-[20px] leading-none font-bold tracking-[0.03em] text-black">
                    ...
                  </span>
                )}
              </span>
              <span className="text-b2-regular whitespace-nowrap text-black">{target.label}</span>
            </Button>
          </li>
        ))}
      </ul>
    </dialog>
  )
}

export default ShareSheet
