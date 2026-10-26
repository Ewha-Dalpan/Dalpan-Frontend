import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import stand from '../../assets/jury/participation/stand.svg'
import beam from '../../assets/jury/participation/beam.svg'
import strings from '../../assets/jury/participation/left-strings.svg'
import bowl from '../../assets/jury/participation/left-bowl.svg'
import shade from '../../assets/jury/participation/left-shade.svg'
import rim from '../../assets/jury/participation/left-rim.svg'
import shine from '../../assets/jury/participation/left-shine.svg'
import joint from '../../assets/jury/participation/left-joint.svg'
import jointShine from '../../assets/jury/participation/left-joint-shine.svg'
import jointShade from '../../assets/jury/participation/left-joint-shade.svg'
import rightPan from '../../assets/jury/participation/right-pan.svg'
import rightFront from '../../assets/jury/participation/right-front.svg'
import leftFront from '../../assets/jury/participation/left-front.svg'
import riceCake from '../../assets/jury/participation/rice-cake.png'
import dot from '../../assets/jury/participation/ratio-dot.svg'
import hint from '../../assets/jury/participation/hint.svg'

type Side = 'left' | 'right'
type Props = { value: number; touched: boolean; showHint: boolean; onChange: (value: number) => void; onTouch: () => void }
const parts = [
  { src: strings, x: 32.33282, y: 576.05808 },
  { src: bowl, x: 27.50521, y: 661.33962 },
  { src: shade, x: 27.17578, y: 661.42879 },
  { src: rim, x: 27.71104, y: 660.24722 },
  { src: shine, x: 113.44188, y: 666.68901 },
  { src: joint, x: 64.44314, y: 555.5303 },
  { src: jointShine, x: 81.19594, y: 560.80334 },
  { src: jointShade, x: 64.33382, y: 560.4675 },
]
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

function JuryBalance({ value, touched, showHint, onChange, onTouch }: Props) {
  const [active, setActive] = useState<Side | null>(null)
  const drag = useRef<{ id: number; y: number; value: number; latest: number; scale: number; side: Side } | null>(null)
  const offset = (value - 50) * 1.4
  const angle = -Math.atan2(offset, 118.65) * 180 / Math.PI
  const motion = active ? '' : 'transition-transform duration-150 ease-out motion-reduce:transition-none'

  const start = (event: PointerEvent<HTMLDivElement>, side: Side) => {
    if (drag.current || !event.isPrimary || event.button !== 0) return
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id: event.pointerId, y: event.clientY, value, latest: value, side, scale: event.currentTarget.getBoundingClientRect().width / 155 }
    setActive(side)
    onTouch()
  }
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const delta = (event.clientY - current.y) / current.scale / 1.4
    current.latest = clamp(current.value + (current.side === 'left' ? delta : -delta))
    onChange(current.latest)
  }
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return
    onChange(Math.round(drag.current.latest / 10) * 10)
    drag.current = null
    setActive(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  const keyDown = (event: KeyboardEvent<HTMLDivElement>, side: Side) => {
    const current = side === 'left' ? value : 100 - value
    let next: number
    switch (event.key) {
      case 'ArrowDown': case 'ArrowRight': next = current + 10; break
      case 'ArrowUp': case 'ArrowLeft': next = current - 10; break
      case 'Home': next = 0; break
      case 'End': next = 100; break
      default: return
    }
    event.preventDefault()
    onTouch()
    onChange(side === 'left' ? clamp(next) : 100 - clamp(next))
  }
  const cakes = (side: Side) => {
    const ratio = side === 'left' ? value : 100 - value
    const count = !touched || ratio <= 25 ? 1 : ratio < 75 ? 2 : 3
    const x = side === 'left' ? 56 : 294
    return Array.from({ length: count }, (_, index) => (
      <img key={index} src={riceCake} alt="" draggable={false} className="absolute size-[51px] max-w-none object-cover"
        style={{ left: x + (count === 1 ? 0 : index === 0 ? -17 : index === 1 ? 17 : 0), top: 200.3503 - (count === 3 && index < 2 ? 9 : 0) }} />
    ))
  }

  return (
    <div className="absolute left-0 top-[375px] h-[429px] w-[393px]">
      {(['left', 'right'] as const).map((side) => {
        const ratio = side === 'left' ? value : 100 - value
        return <div key={side} className="absolute top-0 flex w-[64px] flex-col items-center gap-[4px]" style={{ left: side === 'left' ? 125 : 205 }}>
          <span className="text-b2-regular text-gray-80">{side === 'left' ? '상대방' : '사연자'}</span>
          <output className={`flex h-[54px] w-full items-center justify-center rounded-[8px] bg-keycolor-5 text-[28px] font-bold leading-[42px] tracking-[-0.03em] ${touched && (!active || active === side) ? 'text-keycolor-100' : 'text-keycolor-40'}`}>{ratio}</output>
        </div>
      })}
      {[47, 56].map((top) => <img key={top} src={dot} alt="" className="absolute left-[194px] block max-w-none" style={{ top }} />)}
      {(['left', 'right'] as const).map((side) => (
        <div key={side} aria-hidden="true" className="pointer-events-none absolute top-[61px] w-[42px] text-[12px] font-medium leading-[18px] text-gray-10" style={{ [side]: 0 }}>
          <span className={`block ${side === 'left' ? 'pl-[7px]' : 'pr-[5px] text-right'}`}>0</span>
          <div className={`flex flex-col gap-[5px] ${side === 'right' ? 'items-end' : 'items-start'}`}>
            {Array.from({ length: 21 }, (_, index) => <span key={index} className="block h-[2px] rounded-[8px]" style={{ width: index % 5 === 0 ? 42 : 30, backgroundColor: active === side && index === Math.round((side === 'left' ? value : 100 - value) / 5) ? '#b7a6a7' : '#f3f3f4' }} />)}
          </div>
          <span className={`block ${side === 'left' ? 'pl-[7px]' : 'pr-[5px] text-right'}`}>100</span>
        </div>
      ))}
      <div aria-hidden="true" className="pointer-events-none">
        <img src={stand} alt="" className="absolute left-[123px] top-[130px] block max-w-none" />
        <div className={`absolute inset-0 ${motion}`} style={{ transform: `rotate(${angle}deg)`, transformOrigin: '198px 133px' }}>
          <div className="absolute left-[81.5126px] top-[82.4779px] flex h-[124.666px] w-[231.215px] items-center justify-center">
            <img src={beam} alt="" className="block max-w-none shrink-0 rotate-[-14.73deg] skew-x-[0.55deg]" />
          </div>
          <div className={`absolute inset-0 ${motion}`} style={{ transform: `rotate(${-angle}deg)`, transformOrigin: '82.29439px 150.04165px' }}>
            {parts.map((part) => <img key={part.src} src={part.src} alt="" className="absolute block max-w-none" style={{ left: part.x, top: part.y - 423 }} />)}
            {cakes('left')}
            <img src={leftFront} alt="" className="absolute left-[27px] top-[238.3538px] block max-w-none" />
          </div>
          <div className={`absolute inset-0 ${motion}`} style={{ transform: `rotate(${-angle}deg)`, transformOrigin: '319.59px 151.2743px' }}>
            <img src={rightPan} alt="" className="absolute left-[264.4209px] top-[133.7629px] block max-w-none" />
            {cakes('right')}
            <img src={rightFront} alt="" className="absolute left-[264px] top-[238.3616px] block max-w-none" />
          </div>
        </div>
      </div>
      {(['left', 'right'] as const).map((side) => (
        <div key={side} role="slider" tabIndex={0} aria-label={`${side === 'left' ? '상대방' : '사연자'} 과실 비율`} aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={side === 'left' ? value : 100 - value} aria-valuetext={`${side === 'left' ? value : 100 - value}%`} aria-orientation="vertical"
          aria-describedby="jury-scale-instructions" onPointerDown={(event) => start(event, side)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
          onKeyDown={(event) => keyDown(event, side)} className="absolute top-[90px] z-10 h-[240px] w-[155px] touch-none cursor-ns-resize rounded-lg outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-keycolor-40" style={{ left: side === 'left' ? 10 : 228 }} />
      ))}
      <p id="jury-scale-instructions" className="sr-only">더 잘못한 쪽을 아래로 드래그하세요. 손을 놓으면 10단위로 맞춰집니다. 위아래 방향키로 10씩 조절할 수 있습니다.</p>
      {showHint && !touched && <div role="status" className="pointer-events-none absolute left-[72px] top-[158px] z-20 h-[39.376px] w-[251px]">
        <img src={hint} alt="" className="absolute left-[-41.9px] top-[-41.9px] block max-w-none" />
        <p className="text-l1-regular absolute left-[11px] top-[13.38px] whitespace-nowrap text-white-100">더 잘못한 쪽이 더 무거워지도록 드래그해주세요</p>
      </div>}
    </div>
  )
}

export default JuryBalance
