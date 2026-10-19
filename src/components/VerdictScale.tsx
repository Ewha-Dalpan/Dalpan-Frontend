// 공통 과실비율 저울 그림! (저울 + 접시 위 떡)
// 판결 요약, 저장용 판결문 이미지에서 사용
// 과실 비율 구간에 따라 저울 기울기와 떡 개수가 바뀜 (계산은 utils/verdictScale.ts)

import type { CSSProperties } from 'react'
import riceCake from '../assets/verdict/rice-cake.png'
import { getScaleLayout } from '../utils/verdictScale'

type VerdictScaleProps = {
  myRatio: number // 내 과실 비율 (0~100)
  className?: string
  style?: CSSProperties
}

function VerdictScale({ myRatio, className = '', style }: VerdictScaleProps) {
  const { src, flipped, cakes } = getScaleLayout(myRatio)

  return (
    <div aria-hidden="true" className={`h-[232.659px] w-[274.538px] ${className}`} style={style}>
      {cakes.map(({ x, y, size }, index) => (
        <img
          key={index}
          src={riceCake}
          alt=""
          className="absolute block max-w-none object-cover"
          style={{ left: x, top: y, width: size, height: size }}
        />
      ))}
      <img src={src} alt="" className={`absolute inset-0 block size-full max-w-none ${flipped ? '-scale-x-100' : ''}`} />
    </div>
  )
}

export default VerdictScale
