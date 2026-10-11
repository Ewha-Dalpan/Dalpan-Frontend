// 공통 판결 요약 판결문 카드!
// 크기가 3개! (full/card/preview)
// full: 판결문 전체 화면 / card: 마이 > 내 사건 상세 카드 / preview: 봉투 속 미리보기

import Button from './Button'
import arrow from '../assets/verdict/arrow.svg'
import dot from '../assets/verdict/dot.svg'
import riceCake from '../assets/verdict/rice-cake.png'
import tail1 from '../assets/verdict/reason-tail-1.svg'
import tail2 from '../assets/verdict/reason-tail-2.svg'
import tail3 from '../assets/verdict/reason-tail-3.svg'
import tailLeft from '../assets/verdict/reason-tail-left.svg'
import beam from '../assets/verdict/scale-beam.svg'
import leftPan from '../assets/verdict/scale-left.svg'
import rightPan from '../assets/verdict/scale-right.svg'

// card 크기 기준 너비, 높이와, 크기별 배율
const BASE_WIDTH = 365.73
const BASE_HEIGHT = 440.2
const SCALES = { full: 1.07453, card: 1, preview: 0.79849 }

// TODO: API 연동 시 판결 결과(과실 근거, 과실 비율, 저울 기울기)로 교체
const reasons = [
  { label: '내 과실 근거', x: 22.2, y: 88.41, tail: tailLeft, left: true },
  { label: '약속 전 연락 공백', x: 229.75, y: 87.48, tail: tail2, left: false },
  { label: '일정의 불확실성', x: 234.4, y: 124.71, tail: tail1, left: false },
  { label: '응답성 부족', x: 256.73, y: 161.93, tail: tail3, left: false },
]
const riceCakes = [[226.95, 268.95], [253.94, 263.37], [234.4, 246.62], [74.33, 200.09]]
const ratios = [{ label: '나', value: 10, x: 73.4, y: 262.44 }, { label: '상대', value: 90, x: 229.75, y: 328.51 }]

type VerdictSummaryProps = {
  size: keyof typeof SCALES
  caseNumber: string
  relation: string
  title: string | null
  onWhyClick?: () => void // '왜 이렇게 판단했을까?' (없으면 비활성)
}

function VerdictSummary({ size, caseNumber, relation, title, onWhyClick }: VerdictSummaryProps) {
  const scale = SCALES[size]

  return (
    // 바깥 상자는 확대, 축소된 실제 크기, 안쪽은 card 크기로 그린 뒤 transform으로 맞춤
    <div className="relative" style={{ width: BASE_WIDTH * scale, height: BASE_HEIGHT * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}>
        <div className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center gap-[7.445px] text-[12.098px] leading-normal tracking-[-0.03em] text-gray-50">
          <span>{caseNumber}</span><img src={dot} alt="" className="block max-w-none" /><span>{relation}</span>
        </div>
        <h2 className="absolute inset-x-0 top-[21.41px] text-center text-[18.613px] font-semibold leading-normal tracking-[-0.03em] text-gray-90">{title ?? '사건 요약 준비 중'}</h2>

        {/* 과실 근거 말풍선 칩 */}
        {reasons.map((reason) => (
          <div key={reason.label} className="absolute flex items-center" style={{ left: reason.x, top: reason.y }}>
            {reason.left && <img src={reason.tail} alt="" className="mr-[-15.821px] block max-w-none -scale-x-100" />}
            <span className={`relative flex h-[30.711px] items-center rounded-[18.613px] bg-keycolor-5 px-[11.168px] text-[13.029px] font-semibold leading-normal tracking-[-0.03em] text-keycolor-70 ${reason.left ? '' : 'mr-[-15.821px]'}`}>{reason.label}</span>
            {!reason.left && <img src={reason.tail} alt="" className="block max-w-none" />}
          </div>
        ))}

        {/* 저울 + 떡 */}
        {riceCakes.map(([x, y]) => (
          <img key={`${x}-${y}`} src={riceCake} alt="" className="absolute size-[47.462px] max-w-none object-cover" style={{ left: x, top: y }} />
        ))}
        <div aria-hidden="true" className="absolute left-[40.83px] top-[118.19px] h-[232.659px] w-[274.538px] overflow-hidden">
          <div className="absolute inset-[15.3%_18.37%_51.59%_20.57%] flex items-center justify-center">
            <img src={beam} alt="" className="block max-w-none shrink-0 rotate-[8.85deg] skew-x-[0.55deg]" />
          </div>
          <img src={leftPan} alt="" className="absolute left-[6.62%] top-[13.23%] block max-w-none" />
          <img src={rightPan} alt="" className="absolute left-[64.74%] top-[41.25%] block max-w-none" />
        </div>

        {/* 과실 비율 */}
        {ratios.map((ratio) => (
          <div key={ratio.label} className="absolute flex items-center gap-[3.723px] rounded-[7.445px] bg-gray-5 px-[9.306px] py-[5.584px] text-[13.029px] leading-normal tracking-[-0.03em]" style={{ left: ratio.x, top: ratio.y }}>
            <span className="text-gray-70">{ratio.label}</span><span className="font-semibold text-keycolor-100">{ratio.value}</span>
          </div>
        ))}

        <p className="absolute left-1/2 top-[397.38px] w-[264.301px] -translate-x-1/2 text-center text-[13.96px] font-medium leading-normal tracking-[-0.03em] text-gray-70">상대 쪽으로 저울이 기울었어요.</p>
        <Button
          onClick={onWhyClick}
          aria-disabled={onWhyClick ? undefined : true}
          className={`absolute left-1/2 top-[421.58px] flex -translate-x-1/2 items-center text-[12.098px] font-medium leading-normal tracking-[-0.03em] text-gray-50 ${onWhyClick ? 'cursor-pointer' : ''}`}
        >
          <span className="mr-[-1.861px]">왜 이렇게 판단했을까?</span><img src={arrow} alt="" className="block max-w-none" />
        </Button>
      </div>
    </div>
  )
}

export default VerdictSummary
