// 공통 판결문 봉투 (뒷면 띠 + 앞면)
// 크기, 위치, 애니메이션은 className / style로 넘깁니다!!

import type { CSSProperties, ReactNode } from 'react'
import texture from '../assets/my/cases/folder-texture.png'

type EnvelopePartProps = {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

// 봉투 뒷면 (위쪽 띠)
export function EnvelopeBack({ className = '', style }: EnvelopePartProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden rounded-t-[8.512px] ${className}`} style={style}>
      <img src={texture} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(180deg, rgba(102,102,102,0) 0%, rgba(0,0,0,0.06) 100%), linear-gradient(181.86809879554113deg, rgba(201,160,128,0.5) 3.4489%, rgba(180,140,106,0.5) 93.836%)' }} />
    </div>
  )
}

// 봉투 앞면 (children: 도장처럼 앞면 위에 올릴 것, 봉투 밖으로 나가도 안 잘림)
export function EnvelopeFront({ className = '', style, children }: EnvelopePartProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`} style={style}>
      <div className="absolute inset-0 overflow-hidden rounded-b-[8.512px]">
        <img src={texture} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(199.54403825648333deg, rgba(201,160,128,0.5) 3.4489%, rgba(216,179,148,0.5) 93.836%)' }} />
      </div>
      {children}
    </div>
  )
}
