import { Navigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import { paths } from '../../routes/paths'
import { exampleMyCases } from './exampleMyCases'
import texture from '../../assets/my/cases/folder-texture.png'
import rabbit from '../../assets/my/verdict/rabbit-weight.png'
import dot from '../../assets/my/verdict/dot.svg'
import tail1 from '../../assets/my/verdict/reason-tail-1.svg'
import tail2 from '../../assets/my/verdict/reason-tail-2.svg'
import tailLeft from '../../assets/my/verdict/reason-tail-left.svg'
import tail3 from '../../assets/my/verdict/reason-tail-3.svg'
import arrow from '../../assets/my/verdict/arrow.svg'
import beam from '../../assets/my/verdict/scale-beam.svg'
import leftPan from '../../assets/my/verdict/scale-left.svg'
import rightPan from '../../assets/my/verdict/scale-right.svg'

const reasons = [
  { label: '내 과실 근거', x: 35.84, y: 248.41, tail: tailLeft, left: true },
  { label: '약속 전 연락 공백', x: 243.38, y: 247.48, tail: tail2, left: false },
  { label: '일정의 불확실성', x: 248.03, y: 284.71, tail: tail1, left: false },
  { label: '응답성 부족', x: 270.36, y: 321.93, tail: tail3, left: false },
]

function MyCaseDetailPage() {
  const { caseId } = useParams()
  const item = exampleMyCases.find((entry) => String(entry.id) === caseId)

  if (!item) return <Navigate to={paths.myCases} replace />

  return (
    <section aria-label={`${item.category} ${item.date} 접수 사건 판결문`} className="relative h-[calc(100dvh-51px)] overflow-clip pt-[19px] [container-type:inline-size]">
      <div key={caseId} className="h-[min(506px,128.753181cqw)] motion-safe:animate-[verdict-reveal_850ms_cubic-bezier(0.22,1,0.36,1)_both]">
      <div className="relative h-[506px] w-[393px] origin-top-left scale-[min(1,calc(100cqw/393px))]">
        <div className="absolute inset-y-0 left-[24px] w-[345px] rounded-[8px] bg-white-100" />
        <div className="absolute left-[196.38px] top-[36px] flex -translate-x-1/2 items-center gap-[7.445px] text-[12.098px] leading-[1.5] tracking-[-0.03em] text-gray-50">
          <span>月 제0241호</span><img src={dot} alt="" className="block max-w-none" /><span>연인</span>
        </div>
        <h1 className="absolute left-[110.29px] top-[57.41px] text-[18.613px] font-semibold leading-[1.5] tracking-[-0.03em] text-gray-90">{item.title ?? '사건 요약 준비 중'}</h1>
        {reasons.map((reason) => (
          <div key={reason.label} className="absolute flex items-center" style={{ left: reason.x, top: reason.y - 124 }}>
            {reason.left && <img src={reason.tail} alt="" className="mr-[-15.821px] block max-w-none -scale-x-100" />}
            <span className={`relative flex h-[30.711px] items-center rounded-[18.613px] bg-keycolor-5 px-[11.168px] text-[13.029px] font-semibold leading-[1.5] tracking-[-0.03em] text-keycolor-70 ${reason.left ? '' : 'mr-[-15.821px]'}`}>{reason.label}</span>
            {!reason.left && <img src={reason.tail} alt="" className="block max-w-none" />}
          </div>
        ))}
        {[[240.58, 428.95], [267.57, 423.37], [248.03, 406.62], [87.96, 360.09]].map(([x, y]) => (
          <img key={`${x}-${y}`} src={rabbit} alt="" className="absolute size-[47.462px] max-w-none object-cover" style={{ left: x, top: y - 124 }} />
        ))}
        <div aria-hidden="true" className="absolute left-[54.46px] top-[154.19px] h-[232.659px] w-[274.538px] overflow-hidden">
          <div className="absolute inset-[15.3%_18.37%_51.59%_20.57%] flex items-center justify-center">
            <img src={beam} alt="" className="block max-w-none shrink-0 rotate-[8.85deg] skew-x-[0.55deg]" />
          </div>
          <img src={leftPan} alt="" className="absolute left-[6.62%] top-[13.23%] block max-w-none" />
          <img src={rightPan} alt="" className="absolute left-[64.74%] top-[41.25%] block max-w-none" />
        </div>
        {[{ label: '나', value: 10, x: 87.03, y: 422.44 }, { label: '상대', value: 90, x: 243.38, y: 488.51 }].map((ratio) => (
          <div key={ratio.label} className="absolute flex items-center gap-[3.723px] rounded-[7.445px] bg-gray-5 px-[9.306px] py-[5.584px] text-[13.029px] leading-[1.5] tracking-[-0.03em]" style={{ left: ratio.x, top: ratio.y - 124 }}>
            <span className="text-gray-70">{ratio.label}</span><span className="font-semibold text-keycolor-100">{ratio.value}</span>
          </div>
        ))}
        <p className="absolute left-[196.84px] top-[433.38px] w-[264.301px] -translate-x-1/2 text-center text-[13.96px] font-medium leading-[1.5] tracking-[-0.03em] text-gray-70">상대 쪽으로 저울이 기울었어요.</p>
        <Button aria-disabled="true" className="absolute left-[196.84px] top-[457.58px] flex -translate-x-1/2 items-center text-[12.098px] font-medium leading-[1.5] tracking-[-0.03em] text-gray-50">
          <span className="mr-[-1.861px]">왜 이렇게 판단했을까?</span><img src={arrow} alt="" className="block max-w-none" />
        </Button>
      </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none relative z-10 ml-[14px] mr-[13px] mt-[24px] overflow-hidden rounded-[8.512px]">
        <div className="relative h-[45.75px]">
          <img src={texture} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(180deg, rgba(102,102,102,0) 0%, rgba(0,0,0,0.06) 100%), linear-gradient(181.86809879554113deg, rgba(201,160,128,0.5) 3.4489%, rgba(180,140,106,0.5) 93.836%)' }} />
        </div>
        <div className="relative h-[497.93px]">
          <img src={texture} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(199.54403825648333deg, rgba(201,160,128,0.5) 3.4489%, rgba(216,179,148,0.5) 93.836%)' }} />
        </div>
      </div>
    </section>
  )
}

export default MyCaseDetailPage
