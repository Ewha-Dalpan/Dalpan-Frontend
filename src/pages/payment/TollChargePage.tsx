// 결제 - 톨 충전 (2.2.2)
// 보유 톨 + 충전 상품 목록, 가격 버튼을 누르면
// 주문 생성 → Paddle 결제창 → 결제 확인(주문 상태가 PAID가 될 때까지 조회) → 결제 완료
// 톨 부족 창 '톨 충전하러 가기' / 마이 '톨 충전하기'에서 들어옴

import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createOrder, getCoinProducts, getOrder } from '../../apis/paymentApi'
import chargeMoon from '../../assets/payment/charge-moon.svg'
import chargeRabbit from '../../assets/payment/charge-rabbit.svg'
import divider from '../../assets/payment/divider.svg'
import Header from '../../components/Header'
import TollIcon from '../../components/TollIcon'
import Toast from '../../components/Toast'
import { useCoinBalance } from '../../hooks/useCoinBalance'
import { useGoBack } from '../../hooks/useGoBack'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import type { CoinProduct } from '../../types/payment'
import { getApiErrorMessage } from '../../utils/apiError'
import { loadPaddle, openPaddleCheckout } from '../../utils/paddle'

// '인기' 칸에 맨 위로 보여줄 상품
const POPULAR_COIN_AMOUNT = 10

// 결제 후 주문 상태를 다시 조회하는 간격, 최대로 기다리는 시간 (ms)
const ORDER_POLL_MS = 2000
const ORDER_TIMEOUT_MS = 60000

const PADDLE_LOAD_ERROR = '결제창을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

// 상품 한 줄: 톨 수량 · 가격 버튼 · 아래 구분선
function ProductRow({ product, disabled, onSelect }: { product: CoinProduct; disabled: boolean; onSelect: (product: CoinProduct) => void }) {
  const price = formatPrice(product.price_krw)
  return (
    <li>
      <div className="flex h-6.75 items-center justify-between pl-0.75">
        <span className="flex items-center gap-1.25">
          <TollIcon />
          <span className="text-b2-semibold text-gray-90">{product.coin_amount}톨</span>
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
  const queryClient = useQueryClient()
  const goBack = useGoBack(paths.my) // 들어온 화면으로 (톨 부족 창 또는 마이)
  const { data: balance } = useCoinBalance()
  const { toast, showToast, hideToast } = useToast()

  // 충전 상품 목록
  const { data: products, isError: isProductsError } = useQuery({
    queryKey: ['coinProducts'],
    queryFn: getCoinProducts,
    staleTime: 5 * 60 * 1000,
  })
  const popular = products?.find((product) => product.coin_amount === POPULAR_COIN_AMOUNT)

  // 결제창을 빨리 열 수 있게 Paddle을 미리 불러둠
  useEffect(() => {
    void loadPaddle()
  }, [])

  // 결제 진행 상태: 주문 만드는 중, 결제창 열림, 결제 확인 중
  const [step, setStep] = useState<'idle' | 'ordering' | 'paying' | 'confirming'>('idle')
  const [paidOrderId, setPaidOrderId] = useState<string | null>(null) // 결제창에서 결제를 마친 주문
  const isBusy = step !== 'idle'
  const isSelecting = useRef(false) // 빠르게 두 번 눌러서 주문이 두 개 생기지 않게

  // 가격 버튼 → 주문 생성(상품 ID만 보냄) → Paddle 결제창
  const handleSelect = async (product: CoinProduct) => {
    if (isSelecting.current) return
    isSelecting.current = true
    setStep('ordering')
    const stop = (message: string) => {
      isSelecting.current = false
      setStep('idle')
      showToast(message)
    }
    try {
      const created = await createOrder(product.id)
      setStep('paying')
      const opened = await openPaddleCheckout({
        priceId: created.paddle_price_id,
        orderId: created.order_id,
        onCompleted: () => {
          setStep('confirming')
          setPaidOrderId(created.order_id)
        },
        onClosed: () => {
          isSelecting.current = false
          setStep('idle')
        },
      })
      if (!opened) stop(PADDLE_LOAD_ERROR)
    } catch (error) {
      stop(getApiErrorMessage(error))
    }
  }

  // 결제를 마치면 백엔드가 톨을 지급할 때까지(PAID) 주문 상태를 몇 초 간격으로 조회
  const { data: order, isError: isOrderError } = useQuery({
    queryKey: ['order', paidOrderId],
    queryFn: () => getOrder(paidOrderId!),
    enabled: paidOrderId !== null,
    refetchInterval: (query) => (!query.state.data || query.state.data.status === 'PENDING' ? ORDER_POLL_MS : false),
  })

  // 결제 확인 결과에 따라 이동, 안내
  useEffect(() => {
    if (!paidOrderId) return
    const reset = (message: string) => {
      showToast(message)
      setPaidOrderId(null)
      setStep('idle')
      isSelecting.current = false
    }
    if (order?.status === 'PAID') {
      // 톨이 늘었으니 보유 톨, 내 정보를 다시 불러오게 하고 결제 완료로
      void queryClient.invalidateQueries({ queryKey: ['coinBalance'] })
      void queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate(paths.paymentComplete, { replace: true })
      return
    }
    if (order?.status === 'EXPIRED') return reset('결제 시간이 지나 주문이 만료됐어요. 다시 시도해 주세요.')
    if (order?.status === 'REFUNDED') return reset('환불된 주문이에요.')
    if (isOrderError) return reset('결제를 확인하지 못했어요. 잠시 후 보유 톨을 확인해 주세요.')

    // 너무 오래 PAID가 안 되면 (결제 완료 알림 지연 등) 안내하고 멈춤
    const timer = setTimeout(() => reset('결제 확인이 늦어지고 있어요. 잠시 후 보유 톨을 확인해 주세요.'), ORDER_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [paidOrderId, order?.status, isOrderError, queryClient, navigate, showToast])

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
            {popular && <ProductRow product={popular} disabled={isBusy} onSelect={handleSelect} />}
          </ul>

          <h2 className="text-l1-medium mt-3.25 ml-1.25 flex h-6 w-10 items-center justify-center rounded-[50px] bg-gray-5 text-gray-70">전체</h2>
          <ul className="mt-3.25 flex flex-col gap-4.5">
            {products?.map((product) => (
              <ProductRow key={product.id} product={product} disabled={isBusy} onSelect={handleSelect} />
            ))}
          </ul>
          {!products && (
            <p role="status" className="text-b3-regular mt-3 text-center text-gray-50">
              {isProductsError ? '상품을 불러오지 못했어요.' : '상품을 불러오는 중이에요'}
            </p>
          )}
        </div>
      </main>

      {/* 주문을 만들거나 결제를 확인하는 동안 화면을 덮어서 다른 상품을 누르지 못하게 함 (디자인이 없어서 간단한 안내만) */}
      {(step === 'ordering' || step === 'confirming') && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <p role="status" className="text-b2-medium rounded-lg bg-white-100 px-5 py-3 text-gray-90">
            {step === 'ordering' ? '결제창을 여는 중이에요' : '결제를 확인하고 있어요'}
          </p>
        </div>
      )}
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default TollChargePage
