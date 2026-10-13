// 저장/공유용 판결문 이미지!
// 판결문 화면과 달리 요약 문장 대신 아래에 달판 로고가 들어감~

import type { Ref } from 'react'
import dot from '../assets/verdict/dot.svg'
import logoRabbit from '../assets/verdict/logo-rabbit.png'
import logoText from '../assets/verdict/logo-text.svg'
import tail from '../assets/verdict/reason-tail-full.svg'
import riceCake from '../assets/verdict/rice-cake.png'
import title from '../assets/verdict/title.svg'
import VerdictScale from './VerdictScale'

const SCALE_ZOOM = 1.07453

// TODO: API 연동 시 과실 비율에 따라 떡 개수·위치 바꾸기
const riceCakes = [[244, 497], [273, 491], [252, 473], [80, 423]]

type VerdictShareImageProps = {
  ref?: Ref<HTMLDivElement>
  caseNumber: string
  relation: string
  title: string
  myReasons: string[] // 내 과실 근거 (왼쪽)
  otherReasons: string[] // 상대 과실 근거 (오른쪽)
  myRatio: number
  otherRatio: number
}

// 말풍선 칩
function ReasonChip({ label, side }: { label: string; side: 'left' | 'right' }) {
  const chip = <span className="text-b3-semibold relative flex h-8.25 items-center rounded-[20px] bg-keycolor-5 px-3 text-keycolor-70">{label}</span>
  return side === 'left' ? (
    <div className="flex items-center">
      <img src={tail} alt="" className="mr-[-17px] block max-w-none -scale-x-100" />
      {chip}
    </div>
  ) : (
    <div className="flex items-center">
      <span className="mr-[-17px] flex">{chip}</span>
      <img src={tail} alt="" className="block max-w-none" />
    </div>
  )
}

function RatioBadge({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={`text-b3-regular absolute flex items-center gap-1 rounded-lg bg-gray-5 px-2.5 py-1.5 ${className}`}>
      <span className="text-gray-70">{label}</span>
      <span className="font-semibold text-keycolor-100">{value}</span>
    </div>
  )
}

function VerdictShareImage({ ref, caseNumber, relation, title: caseTitle, myReasons, otherReasons, myRatio, otherRatio }: VerdictShareImageProps) {
  return (
    <div ref={ref} className="relative h-213 w-98.25 overflow-hidden bg-white-100">
      <img src={title} alt="판결문" className="absolute top-19 left-1/2 block max-w-none -translate-x-1/2" />
      <p className="text-l1-regular absolute top-32.25 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-gray-50">
        {caseNumber}
        <img src={dot} alt="" className="block max-w-none" />
        {relation}
      </p>
      <p className="text-h3-semibold absolute inset-x-0 top-38 text-center text-gray-90">{caseTitle}</p>

      {/* 과실 근거: 왼쪽은 내 근거, 오른쪽은 상대 근거 */}
      <div className="absolute top-64 left-6 flex flex-col items-start gap-1.75">
        {myReasons.map((reason) => (
          <ReasonChip key={reason} label={reason} side="left" />
        ))}
      </div>
      <div className="absolute top-63.75 right-5.75 flex flex-col items-end gap-1.75">
        {otherReasons.map((reason) => (
          <ReasonChip key={reason} label={reason} side="right" />
        ))}
      </div>

      {/* 저울 + 떡 */}
      {riceCakes.map(([x, y]) => (
        <img key={`${x}-${y}`} src={riceCake} alt="" className="absolute size-12.75 max-w-none object-cover" style={{ left: x, top: y }} />
      ))}
      <VerdictScale className="absolute top-83.75 left-11 origin-top-left" style={{ transform: `scale(${SCALE_ZOOM})` }} />

      {/* 과실 비율 */}
      <RatioBadge label="사연자" value={myRatio} className="top-[501px] left-[69px]" />
      <RatioBadge label="상대방" value={otherRatio} className="top-142 left-60.25" />

      {/* 달판 로고 */}
      <div className="absolute top-[697px] left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        <span className="relative size-8 overflow-hidden rounded-lg bg-bg">
          {/* 토끼 일러스트에서 얼굴 부분만 보이게 잘라냄 */}
          <span className="absolute top-[calc(50%-4.5px)] left-[calc(50%+0.5px)] h-13.25 w-9.75 -translate-1/2 overflow-hidden">
            <img src={logoRabbit} alt="" className="absolute top-0 left-0 h-[122.62%] w-full max-w-none" />
          </span>
        </span>
        <img src={logoText} alt="달판" className="block max-w-none" />
      </div>
    </div>
  )
}

export default VerdictShareImage
