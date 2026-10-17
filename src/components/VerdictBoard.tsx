// 공통 판결문 보드 (판결문 제목 + 사건 + 과실 근거 + 저울 + 과실 비율 + 달판 로고, 너비 393px)
// image: 저장, 공유용 이미지 / page: 공유 받은 사람이 보는 화면 
// 두 화면은 같은 구성이고 세로 위치만 달라서 variant로 나눔~

import type { ReactNode, Ref } from 'react'
import dot from '../assets/verdict/dot.svg'
import logoRabbit from '../assets/verdict/logo-rabbit.png'
import logoText from '../assets/verdict/logo-text.svg'
import tail from '../assets/verdict/reason-tail-full.svg'
import riceCake from '../assets/verdict/rice-cake.png'
import titleImage from '../assets/verdict/title.svg'
import VerdictScale from './VerdictScale'

const LAYOUTS = {
  image: { height: 852, title: 76, caseNumber: 129, caseTitle: 152, reasons: 256, scale: 335, myRatio: 501, otherRatio: 568, logo: 697 },
  page: { height: 798, title: 22, caseNumber: 84, caseTitle: 107, reasons: 179, scale: 245, myRatio: 400, otherRatio: 471, logo: 643 },
}

const SCALE_ZOOM = 1.07453

// 떡 위치 (저울 위쪽 기준) TODO: API 연동 시 과실 비율에 따라 떡 개수·위치 바꾸기
const riceCakes = [[244, 162], [273, 156], [252, 138], [80, 88]]

export type VerdictBoardData = {
  caseNumber: string
  relation: string
  title: string
  myReasons: string[] // 내 과실 근거 (왼쪽)
  otherReasons: string[] // 상대 과실 근거 (오른쪽)
  myRatio: number
  otherRatio: number
}

type VerdictBoardProps = VerdictBoardData & {
  variant: keyof typeof LAYOUTS
  ref?: Ref<HTMLDivElement>
  children?: ReactNode // 화면별로 추가할 내용 (보드 안에서 absolute로 배치)
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

function RatioBadge({ label, value, left, top }: { label: string; value: number; left: number; top: number }) {
  return (
    <div className="text-b3-regular absolute flex items-center gap-1 rounded-lg bg-gray-5 px-2.5 py-1.5" style={{ left, top }}>
      <span className="text-gray-70">{label}</span>
      <span className="font-semibold text-keycolor-100">{value}</span>
    </div>
  )
}

function VerdictBoard({ variant, ref, caseNumber, relation, title, myReasons, otherReasons, myRatio, otherRatio, children }: VerdictBoardProps) {
  const y = LAYOUTS[variant]

  return (
    <div ref={ref} className="relative w-98.25 overflow-hidden bg-white-100" style={{ height: y.height }}>
      <img src={titleImage} alt="판결문" className="absolute left-1/2 block max-w-none -translate-x-1/2" style={{ top: y.title }} />
      <p className="text-l1-regular absolute left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-gray-50" style={{ top: y.caseNumber }}>
        {caseNumber}
        <img src={dot} alt="" className="block max-w-none" />
        {relation}
      </p>
      <p className="text-h3-semibold absolute inset-x-0 text-center text-gray-90" style={{ top: y.caseTitle }}>
        {title}
      </p>

      {/* 과실 근거: 왼쪽은 내 근거, 오른쪽은 상대 근거 (오른쪽 끝을 맞춰 아래로 쌓음) */}
      <div className="absolute left-6 flex flex-col items-start gap-1.75" style={{ top: y.reasons }}>
        {myReasons.map((reason) => (
          <ReasonChip key={reason} label={reason} side="left" />
        ))}
      </div>
      <div className="absolute right-5.75 flex flex-col items-end gap-1.75" style={{ top: y.reasons - 1 }}>
        {otherReasons.map((reason) => (
          <ReasonChip key={reason} label={reason} side="right" />
        ))}
      </div>

      {/* 저울 + 떡 */}
      {riceCakes.map(([x, dy]) => (
        <img key={`${x}-${dy}`} src={riceCake} alt="" className="absolute size-12.75 max-w-none object-cover" style={{ left: x, top: y.scale + dy }} />
      ))}
      <VerdictScale className="absolute left-11 origin-top-left" style={{ top: y.scale, transform: `scale(${SCALE_ZOOM})` }} />

      {/* 과실 비율 */}
      <RatioBadge label="사연자" value={myRatio} left={69} top={y.myRatio} />
      <RatioBadge label="상대방" value={otherRatio} left={241} top={y.otherRatio} />

      {children}

      {/* 달판 로고 */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5" style={{ top: y.logo }}>
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

export default VerdictBoard
