// 결제 - 이용권 충전 (2.2.2)
// 보유 이용권 + 충전 상품 목록, 가격 버튼을 누르면
// 휴대폰 번호 입력 → 주문 생성 → 받은 pay_url(PayApp 결제창)로 이동 → 결제 후 결제 결과 화면으로 돌아옴
// 이용권 부족 창 '이용권 충전하러 가기' / 마이 '톨 충전하기'에서 들어옴

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { createOrder, getCoinProducts } from '../../apis/paymentApi'
import chargeMoon from '../../assets/payment/charge-moon.svg'
import chargeRabbit from '../../assets/payment/charge-rabbit.svg'
import divider from '../../assets/payment/divider.svg'
import Header from '../../components/Header'
import Modal from '../../components/modal/Modal'
import TollIcon from '../../components/TollIcon'
import { useCoinBalance } from '../../hooks/useCoinBalance'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import { useUploadDraftStore } from '../../store/useUploadDraftStore'
import type { CoinProduct } from '../../types/payment'
import { getApiErrorMessage } from '../../utils/apiError'
import { saveStoredDraft } from '../../utils/uploadDraftStorage'
import { formatPrice } from './coinProduct'

// '인기' 칸에 맨 위로 보여줄 상품 (피그마 기준 5톨)
const POPULAR_COIN_AMOUNT = 5

// 하이픈, 공백을 뺀 휴대폰 번호 (국내 010 번호만 결제 가능)
const normalizePhone = (phone: string) => phone.replace(/[-\s]/g, '')
const isValidPhone = (phone: string) => /^010\d{8}$/.test(normalizePhone(phone))

// 409, 502 응답에 주문 번호가 있으면 새 주문을 만들지 않고 그 주문의 상태를 확인해야 함
const getErrorOrderId = (error: unknown) => {
  if (!isAxiosError(error)) return null
  const data: unknown = error.response?.data
  return data && typeof data === 'object' && 'order_id' in data && typeof data.order_id === 'string' ? data.order_id : null
}

// 상품 한 줄: 톨 수량 (+ 보너스) · 가격 버튼 · 아래 구분선
function ProductRow({ product, disabled, onSelect }: { product: CoinProduct; disabled: boolean; onSelect: (product: CoinProduct) => void }) {
  const price = formatPrice(product.price_krw)
  return (
    <li>
      <div className="flex h-6.75 items-center justify-between pl-0.75">
        <span className="flex items-center gap-1.25">
          <TollIcon />
          <span className="text-b2-semibold text-gray-90">{product.base_coin_amount}톨</span>
          {product.bonus_coin_amount > 0 && <span className="text-l2-medium text-[#ff5634]">+ {product.bonus_coin_amount}톨 보너스</span>}
        </span>
        <button
          type="button"
          aria-label={`${product.coin_amount}톨 ${price} 결제하기`}
          disabled={disabled}
          onClick={() => onSelect(product)}
          className="text-l1-medium h-6.5 w-17.5 cursor-pointer rounded-sm bg-[#292929] text-white-100 transition-[scale] duration-200 enabled:hover:scale-[1.05] disabled:cursor-default motion-reduce:transition-none"
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

  // 충전 상품 목록
  const { data: products, isError: isProductsError } = useQuery({
    queryKey: ['coinProducts'],
    queryFn: getCoinProducts,
    staleTime: 5 * 60 * 1000,
  })
  const popular = products?.find((product) => product.coin_amount === POPULAR_COIN_AMOUNT)

  // 진행 중인 결제 시도: 고른 상품 + 이 시도의 중복 방지 키 (새로 고를 때만 새 키, 다시 보낼 땐 같은 키)
  const [attempt, setAttempt] = useState<{ product: CoinProduct; idempotencyKey: string } | null>(null)
  const [phone, setPhone] = useState('')
  const [orderError, setOrderError] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const draft = useUploadDraftStore((state) => state.draft) // 톨이 부족해서 접수 못 한 사진
  const canOrder = isValidPhone(phone) && !isOrdering

  // 결제창에서 뒤로가기로 돌아오면 브라우저가 이전 화면 상태를 그대로 보여줄 수 있어서 처음 상태로 되돌림
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      setIsOrdering(false)
      setAttempt(null)
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  // 가격 버튼 → 휴대폰 번호 입력 창
  const handleSelect = (product: CoinProduct) => {
    setOrderError('')
    setAttempt({ product, idempotencyKey: crypto.randomUUID() })
  }

  const closeModal = () => {
    if (!isOrdering) setAttempt(null)
  }

  // 주문 생성 → PayApp 결제창으로 이동 (가격, 지급량은 서버가 정함)
  const handleOrder = async () => {
    if (!attempt || !canOrder) return
    setIsOrdering(true)
    setOrderError('')
    try {
      const created = await createOrder({
        productId: attempt.product.id,
        recvphone: normalizePhone(phone),
        idempotencyKey: attempt.idempotencyKey,
      })
      // 결제창으로 나가면 메모리가 지워지므로, 돌아와서 바로 접수할 수 있게 사진을 보관해 둠
      if (draft) await saveStoredDraft({ orderId: created.order_id, ...draft })
      window.location.assign(created.pay_url)
    } catch (error) {
      const orderId = getErrorOrderId(error)
      if (orderId) {
        navigate(`${paths.paymentResult}?order_id=${encodeURIComponent(orderId)}`, { replace: true })
        return
      }
      setIsOrdering(false)
      setOrderError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-98.25 overflow-hidden bg-bg pb-10 text-white-100">
      {/* 윗부분은 피그마 좌표 그대로 배치 (피그마 y - 56 = 화면 y, 헤더 아이콘 기준) */}
      {/* 배경: 달 (헤더 아래로 크게 깔림) */}
      <img src={chargeMoon} alt="" aria-hidden="true" className="pointer-events-none absolute top-32.5 -left-100.5 block max-w-none" />

      <div className="relative">
        <Header depth={2} title="이용권 충전" onBack={goBack} />
      </div>

      {/* 떡을 뿌리는 토끼 (아래쪽은 '이용권' 박스에 살짝 가려짐) */}
      <img src={chargeRabbit} alt="" aria-hidden="true" className="pointer-events-none absolute top-12.5 left-[170px] block max-w-none" />

      <section aria-label="보유 이용권" className="absolute top-14.25 left-6.75">
        <p className="text-l1-medium">보유 이용권</p>
        <p className="text-h2-medium mt-1.5 flex items-center gap-1.5">
          <TollIcon size="lg" />
          {balance === undefined ? '-' : `${balance}톨`}
        </p>
      </section>

      <h1 className="text-h3-medium absolute top-45.5 left-6.75 text-gray-100">이용권을 충전해요.</h1>

      {/* 목록 헤더(화면 y 228)부터는 차례로 쌓음: 헤더 51 + 177 */}
      <main className="relative px-6 pt-44.25">
        {/* 목록 헤더: 이용권 / 결제금액 */}
        <div className="text-l1-medium flex h-13 items-center justify-between rounded-lg bg-white-100 pr-4.5 pl-4.25 text-[#343434] shadow-[0_0_30px_rgba(138,63,53,0.25)]">
          <span>이용권</span>
          <span>결제금액</span>
        </div>

        {/* 상품 목록: 인기(맨 위 고정) + 전체 */}
        {/* 뱃지: 40×24 고정 · 글자 가운데 · 모서리 50 (피그마 '인기/전체'), 뱃지와 목록 사이 13 */}
        <div className="relative mt-4.75 rounded-lg bg-white-100 pt-4.75 pr-2.75 pb-5.75 pl-3 shadow-[0_0_100px_rgba(0,0,0,0.1)]">
          <h2 className="text-l1-medium ml-1.25 flex h-6 w-10 items-center justify-center rounded-[50px] bg-linear-to-l from-[#2e73fd] to-[#f9217f] font-semibold text-white-100">인기</h2>
          <ul className="mt-3.25">
            {popular && <ProductRow product={popular} disabled={isOrdering} onSelect={handleSelect} />}
          </ul>

          <h2 className="text-l1-medium mt-3.25 ml-1.25 flex h-6 w-10 items-center justify-center rounded-[50px] bg-gray-5 text-gray-70">전체</h2>
          <ul className="mt-3.25 flex flex-col gap-4.5">
            {products?.map((product) => (
              <ProductRow key={product.id} product={product} disabled={isOrdering} onSelect={handleSelect} />
            ))}
          </ul>
          {!products && (
            <p role="status" className="text-b3-regular mt-3 text-center text-gray-50">
              {isProductsError ? '상품을 불러오지 못했어요.' : '상품을 불러오는 중이에요'}
            </p>
          )}
        </div>
      </main>

      <Modal
        open={attempt !== null}
        title="휴대폰 번호를 입력해 주세요"
        description={attempt && `${attempt.product.name} ${formatPrice(attempt.product.price_krw)} 결제에 필요해요. 국내 010 번호만 사용할 수 있어요.`}
        cancelText="취소"
        confirmText={isOrdering ? '결제창 여는 중...' : '결제하기'}
        cancelDisabled={isOrdering}
        confirmDisabled={!canOrder}
        onCancel={closeModal}
        onConfirm={() => void handleOrder()}
      >
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          aria-label="휴대폰 번호"
          placeholder="01012345678"
          maxLength={13}
          value={phone}
          disabled={isOrdering}
          onChange={(event) => setPhone(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void handleOrder()
          }}
          className="text-b2-regular mt-3 h-11 w-full rounded-lg border border-gray-20 bg-white-100 px-3 text-gray-90 placeholder:text-gray-40"
        />
        {orderError && <p role="alert" className="text-l1-regular mt-2 text-[#ff5634]">{orderError}</p>}
      </Modal>
    </div>
  )
}

export default TollChargePage
