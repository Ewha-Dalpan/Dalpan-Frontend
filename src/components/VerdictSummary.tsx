// 공통 판결 요약 판결문 카드!
// 크기가 3개! (full/card/preview)
// full: 판결문 전체 화면 / card: 마이 > 내 사건 상세 카드 / preview: 봉투 속 미리보기

import Button from './Button'
import arrow from '../assets/verdict/arrow.svg'
import dot from '../assets/verdict/dot.svg'
import tail1 from '../assets/verdict/reason-tail-1.svg'
import tail2 from '../assets/verdict/reason-tail-2.svg'
import tail3 from '../assets/verdict/reason-tail-3.svg'
import tailLeft from '../assets/verdict/reason-tail-left.svg'
import { getScaleLayout } from '../utils/verdictScale'
import type { Point } from '../utils/verdictScale'
import VerdictScale from './VerdictScale'

// card 크기 기준 너비, 높이와, 크기별 배율
const BASE_WIDTH = 365.73
const BASE_HEIGHT = 440.2
const SCALES = { full: 1.07453, card: 1, preview: 0.79849 }

// 저울 위치 (카드 왼쪽 위 기준)
const SCALE_LEFT = 40.83
const SCALE_TOP = 118.19

// 과실 비율 배지: 접시 왼쪽 위에서 떨어진 거리 (접시를 따라 같이 움직임)
const MY_BADGE_OFFSET: Point = [14.4, 113.3]
const OTHER_BADGE_OFFSET: Point = [11.2, 113.9]

// 한쪽에 보여주는 과실 근거 칩 최대 개수 (더 많으면 저울과 겹침)
const MAX_REASONS = 3
// 오른쪽 칩 꼬리 모양 (줄마다 저울을 가리키는 각도가 조금씩 다름)
const RIGHT_TAILS = [tail2, tail1, tail3]

type VerdictSummaryProps = {
  size: keyof typeof SCALES
  caseNumber: string
  relation: string
  title: string | null
  myReasons: string[] // 내 과실 근거 (왼쪽 칩)
  otherReasons: string[] // 상대 과실 근거 (오른쪽 칩)
  myRatio: number // 내 과실 비율
  otherRatio: number // 상대 과실 비율
  oneLine: string | null // 한 줄 결과 (예: 상대 쪽으로 저울이 기울었어요.)
  onWhyClick?: () => void // '왜 이렇게 판단했을까?' (없으면 비활성)
}

function VerdictSummary({
  size,
  caseNumber,
  relation,
  title,
  myReasons,
  otherReasons,
  myRatio,
  otherRatio,
  oneLine,
  onWhyClick,
}: VerdictSummaryProps) {
  const scale = SCALES[size]
  const { leftPan, rightPan } = getScaleLayout(myRatio)

  // 과실 비율 배지 (접시 아래)
  const ratios = [
    { label: '나', value: myRatio, pan: leftPan, offset: MY_BADGE_OFFSET },
    { label: '상대', value: otherRatio, pan: rightPan, offset: OTHER_BADGE_OFFSET },
  ]

  // 한 줄 결과가 없으면 과실 비율로 만들어 보여줌
  const resultText =
    oneLine ?? (myRatio === otherRatio ? '저울이 균형을 이뤘어요.' : `${myRatio > otherRatio ? '내' : '상대'} 쪽으로 저울이 기울었어요.`)

  return (
    // 바깥 상자는 확대, 축소된 실제 크기, 안쪽은 card 크기로 그린 뒤 transform으로 맞춤
    <div className="relative" style={{ width: BASE_WIDTH * scale, height: BASE_HEIGHT * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}>
        <div className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center gap-[7.445px] text-[12.098px] leading-normal tracking-[-0.03em] whitespace-nowrap text-gray-50">
          <span>{caseNumber}</span><img src={dot} alt="" className="block max-w-none" /><span>{relation}</span>
        </div>
        <h2 className="absolute inset-x-0 top-[21.41px] text-center text-[18.613px] font-semibold leading-normal tracking-[-0.03em] text-gray-90">{title ?? '사건 요약 준비 중'}</h2>

        {/* 저울 + 떡 (과실 비율에 따라 기울기 · 떡 개수가 바뀜) */}
        <VerdictScale myRatio={myRatio} className="absolute" style={{ left: SCALE_LEFT, top: SCALE_TOP }} />

        {/* 과실 근거 말풍선 칩: 왼쪽은 내 근거, 오른쪽은 상대 근거 (위에서부터 쌓음) */}
        <ul aria-label="내 과실 근거" className="absolute top-[88.41px] left-[22.2px] flex flex-col items-start gap-[6.514px]">
          {myReasons.slice(0, MAX_REASONS).map((reason) => (
            <li key={reason} className="flex items-center">
              <img src={tailLeft} alt="" className="mr-[-15.821px] block max-w-none -scale-x-100" />
              <ReasonChip label={reason} />
            </li>
          ))}
        </ul>
        <ul aria-label="상대 과실 근거" className="absolute top-[87.48px] right-[21.4px] flex flex-col items-end gap-[6.514px]">
          {otherReasons.slice(0, MAX_REASONS).map((reason, index) => (
            <li key={reason} className="flex items-center">
              <span className="mr-[-15.821px] flex">
                <ReasonChip label={reason} />
              </span>
              <img src={RIGHT_TAILS[index]} alt="" className="block max-w-none" />
            </li>
          ))}
        </ul>

        {/* 과실 비율 */}
        {ratios.map((ratio) => (
          <div
            key={ratio.label}
            className="absolute flex items-center gap-[3.723px] rounded-[7.445px] bg-gray-5 px-[9.306px] py-[5.584px] text-[13.029px] leading-normal tracking-[-0.03em] whitespace-nowrap"
            style={{ left: SCALE_LEFT + ratio.pan[0] + ratio.offset[0], top: SCALE_TOP + ratio.pan[1] + ratio.offset[1] }}
          >
            <span className="text-gray-70">{ratio.label}</span><span className="font-semibold text-keycolor-100">{ratio.value}</span>
          </div>
        ))}

        <p className="absolute left-1/2 top-[397.38px] w-[264.301px] -translate-x-1/2 text-center text-[13.96px] font-medium leading-normal tracking-[-0.03em] text-gray-70">{resultText}</p>
        <Button
          onClick={onWhyClick}
          aria-disabled={onWhyClick ? undefined : true}
          className={`absolute left-1/2 top-[421.58px] flex -translate-x-1/2 items-center text-[12.098px] font-medium leading-normal tracking-[-0.03em] whitespace-nowrap text-gray-50 ${onWhyClick ? 'cursor-pointer' : ''}`}
        >
          <span className="mr-[-1.861px]">왜 이렇게 판단했을까?</span><img src={arrow} alt="" className="block max-w-none" />
        </Button>
      </div>
    </div>
  )
}

// 과실 근거 말풍선 칩
function ReasonChip({ label }: { label: string }) {
  return (
    <span className="relative flex h-[30.711px] items-center rounded-[18.613px] bg-keycolor-5 px-[11.168px] text-[13.029px] font-semibold leading-normal tracking-[-0.03em] whitespace-nowrap text-keycolor-70">
      {label}
    </span>
  )
}

export default VerdictSummary
