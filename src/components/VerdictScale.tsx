// 공통 과실비율 저울 그림!
// 판결 요약, 저장용 판결문 이미지에서 사용

import type { CSSProperties } from 'react'
import beam from '../assets/verdict/scale-beam.svg'
import leftPan from '../assets/verdict/scale-left.svg'
import rightPan from '../assets/verdict/scale-right.svg'

type VerdictScaleProps = {
  className?: string
  style?: CSSProperties
}

// TODO: API 연동 시 과실 비율에 따라 기울기 바꾸기
function VerdictScale({ className = '', style }: VerdictScaleProps) {
  return (
    <div aria-hidden="true" className={`h-[232.659px] w-[274.538px] overflow-hidden ${className}`} style={style}>
      <div className="absolute inset-[15.3%_18.37%_51.59%_20.57%] flex items-center justify-center">
        <img src={beam} alt="" className="block max-w-none shrink-0 rotate-[8.85deg] skew-x-[0.55deg]" />
      </div>
      <img src={leftPan} alt="" className="absolute left-[6.62%] top-[13.23%] block max-w-none" />
      <img src={rightPan} alt="" className="absolute left-[64.74%] top-[41.25%] block max-w-none" />
    </div>
  )
}

export default VerdictScale
