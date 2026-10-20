// 결제 - 톨 충전 (2.2.2)
// 보유 톨 + 충전 상품 목록, 가격 버튼을 누르면 결제 → 결제 완료
// 톨 부족 창 '톨 충전하러 가기' / 마이 '톨 충전하기'에서 들어옴

import { useNavigate } from 'react-router-dom'
import chargeMoon from '../../assets/payment/charge-moon.svg'
import chargeRabbit from '../../assets/payment/charge-rabbit.svg'
import divider from '../../assets/payment/divider.svg'
import Header from '../../components/Header'
import TollIcon from '../../components/TollIcon'
import { useCoinBalance } from '../../hooks/useCoinBalance'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import { ALL_PRODUCTS, POPULAR_PRODUCT, type TollProduct } from './tollProducts'

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

// 상품 한 줄: 톨 수량(+ 보너스) · 가격 버튼 · 아래 구분선
function ProductRow({ product, onSelect }: { product: TollProduct; onSelect: (product: TollProduct) => void }) {
  const price = formatPrice(product.price)
  return (
    <li>
      <div className="flex h-6.75 items-center justify-between pl-0.75">
        <span className="flex items-center gap-1.25">
          <TollIcon />
          <span className="text-b2-semibold text-gray-90">{product.coins}톨</span>
          {product.bonus && <span className="text-l2-medium text-[#ff5634]">+ {product.bonus}톨 보너스</span>}
        </span>
        <button
          type="button"
          aria-label={`${product.coins}톨 ${price} 결제하기`}
          onClick={() => onSelect(product)}
          className="text-l1-medium h-6.5 w-17.5 cursor-pointer rounded-sm bg-[#292929] text-white-100 transition-[scale] duration-200 hover:scale-[1.05] motion-reduce:transition-none"
        >
          {price}
        </button>
      </div>
      {/* 구분선은 높이를 차지하지 않음 (피그마: 줄 높이 0) */}
      <img src={divider} alt="" className="mt-3.25 -mb-px block max-w-none" />
    </li>
  )
}

function TollChargePage() {
  const navigate = useNavigate()
  const goBack = useGoBack(paths.my) // 들어온 화면으로 (톨 부족 창 또는 마이)
  const { data: balance } = useCoinBalance()

  // TODO: 결제 API 연동 시 주문 생성(POST /api/payments/orders/) → Paddle 결제창 → 결제 확인 후 결제 완료로 이동
  const handleSelect = () => navigate(paths.paymentComplete, { replace: true })

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-98.25 overflow-hidden bg-bg pb-10 text-white-100">
      {/* 윗부분은 피그마 좌표 그대로 배치 (피그마 y - 56 = 화면 y, 헤더 아이콘 기준) */}
      {/* 배경: 달 (헤더 아래로 크게 깔림) */}
      <img src={chargeMoon} alt="" aria-hidden="true" className="pointer-events-none absolute top-32.5 -left-100.5 block max-w-none" />

      <div className="relative">
        <Header depth={2} title="코인 충전" onBack={goBack} />
      </div>

      {/* 떡을 뿌리는 토끼 (아래쪽은 '충전 코인' 박스에 살짝 가려짐) */}
      <img src={chargeRabbit} alt="" aria-hidden="true" className="pointer-events-none absolute top-12.5 left-[170px] block max-w-none" />

      <section aria-label="보유 코인" className="absolute top-14.25 left-6.75">
        <p className="text-l1-medium">보유 코인</p>
        <p className="text-h2-medium mt-1.5 flex items-center gap-1.5">
          <TollIcon size="lg" />
          {balance === undefined ? '-' : `${balance}톨`}
        </p>
      </section>

      <h1 className="text-h3-medium absolute top-45.5 left-6.75 text-gray-100">톨을 충전해요.</h1>

      {/* 목록 헤더(화면 y 228)부터는 차례로 쌓음: 헤더 51 + 177 */}
      <main className="relative px-6 pt-44.25">
        {/* 목록 헤더: 충전 코인 / 결제금액 */}
        <div className="text-l1-medium flex h-13 items-center justify-between rounded-lg bg-white-100 pr-4.5 pl-4.25 text-[#343434] shadow-[0_0_30px_rgba(138,63,53,0.25)]">
          <span>충전 코인</span>
          <span>결제금액</span>
        </div>

        {/* 상품 목록: 인기(맨 위 고정) + 전체 */}
        {/* 뱃지: 40×24 고정 · 글자 가운데 · 모서리 50 (피그마 '인기/전체'), 뱃지와 목록 사이 13 */}
        <div className="relative mt-4.75 rounded-lg bg-white-100 pt-4.75 pr-2.75 pb-5.75 pl-3 shadow-[0_0_100px_rgba(0,0,0,0.1)]">
          <h2 className="text-l1-medium ml-1.25 flex h-6 w-10 items-center justify-center rounded-[50px] bg-linear-to-l from-[#2e73fd] to-[#f9217f] font-semibold text-white-100">인기</h2>
          <ul className="mt-3.25">
            <ProductRow product={POPULAR_PRODUCT} onSelect={handleSelect} />
          </ul>

          <h2 className="text-l1-medium mt-3.25 ml-1.25 flex h-6 w-10 items-center justify-center rounded-[50px] bg-gray-5 text-gray-70">전체</h2>
          <ul className="mt-3.25 flex flex-col gap-4.5">
            {ALL_PRODUCTS.map((product) => (
              <ProductRow key={product.id} product={product} onSelect={handleSelect} />
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}

export default TollChargePage
