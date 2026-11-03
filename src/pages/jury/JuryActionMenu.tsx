import { useEffect, useRef, useState } from 'react'
import Button from '../../components/Button'
import more from '../../assets/jury/report/more.svg'

export default function JuryActionMenu({ label, actionLabel, onAction }: { label: string; actionLabel: string; onAction: () => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    root.current?.querySelector<HTMLButtonElement>('[role=menuitem]')?.focus()
    // Safari can blur a button before its click without focusing the next button.
    // Close on actual outside interaction, not on that intermediate blur.
    const close = (event: Event) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('focusin', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('focusin', close)
    }
  }, [open])
  return <div ref={root} className="relative shrink-0" onKeyDown={(event) => {
    if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() }
  }}>
    <button ref={trigger} type="button" aria-label={label} aria-expanded={open} aria-haspopup="menu" className="block size-[20px] cursor-pointer" onClick={() => setOpen(!open)}><img src={more} alt="" className="block max-w-none" /></button>
    {open && <div role="menu" aria-label={label} className="absolute right-0 top-[22px] z-50 rounded-[8px] bg-white-100 py-[4px] shadow-[0_0_12.45px_rgba(0,0,0,0.1)]">
      <Button role="menuitem" className="whitespace-nowrap rounded-[20px] px-[10px] py-[4px] text-b3-regular text-gray-80" onClick={() => { setOpen(false); trigger.current?.focus(); onAction() }}>{actionLabel}</Button>
    </div>}
  </div>
}
