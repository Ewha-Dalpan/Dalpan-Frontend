import { useEffect, useId, useRef } from 'react'
import Button from '../../components/Button'
import chevronDown from '../../assets/jury/explore/chevron-down.svg'
import chevronUp from '../../assets/jury/explore/chevron-up.svg'
import check from '../../assets/jury/explore/check.svg'

type JuryFilterDropdownProps = {
  label: string
  value: string
  options: readonly string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (value: string) => void
}

function JuryFilterDropdown({ label, value, options, open, onOpenChange, onChange }: JuryFilterDropdownProps) {
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open, onOpenChange])

  function focusOption(index: number) {
    containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')[index]?.focus()
  }

  return (
    <div ref={containerRef} className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false)
    }} onKeyDown={(event) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
        containerRef.current?.querySelector('button')?.focus()
      }
    }}>
      <Button
        aria-label={`${label}: ${value}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(event) => {
          if (open && event.key === 'ArrowDown') {
            event.preventDefault()
            focusOption(0)
          }
        }}
        className={`text-b3-regular flex cursor-pointer items-center rounded-[50px] border border-white-100 py-[4px] pl-[10px] pr-[8px] ${open ? 'bg-sub' : 'bg-bg'}`}
      >
        {value}<img src={open ? chevronUp : chevronDown} alt="" className="block shrink-0 max-w-none" />
      </Button>
      {open && (
        <div id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[35px] z-10 w-[102px] overflow-hidden rounded-[20px] border border-white-100 bg-bg py-[4px]">
          {options.map((option, index) => (
            <Button key={option} role="menuitemradio" aria-checked={value === option}
              onClick={() => {
                onChange(option)
                onOpenChange(false)
                containerRef.current?.querySelector('button')?.focus()
              }}
              onKeyDown={(event) => {
                const next = event.key === 'ArrowDown' ? (index + 1) % options.length
                  : event.key === 'ArrowUp' ? (index - 1 + options.length) % options.length
                    : event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : null
                if (next !== null) {
                  event.preventDefault()
                  focusOption(next)
                }
              }}
              className={`text-b3-regular flex w-[107px] cursor-pointer items-center whitespace-nowrap px-[16px] py-[4px] ${value === option ? 'text-gray-50' : 'text-white-100'}`}
            >
              {option}{value === option && <img src={check} alt="" className="block shrink-0 max-w-none" />}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default JuryFilterDropdown
