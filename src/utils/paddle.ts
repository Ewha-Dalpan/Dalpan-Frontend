// Paddle 결제창 (Paddle.js v2, overlay 결제창)
// 1. 주문 생성으로 받은 paddle_price_id, order_id로 결제창을 열고
// 2. customData.order_id를 함께 넘겨야 백엔드가 결제 완료(웹훅) 때 톨을 지급함

const SDK_URL = 'https://cdn.paddle.com/paddle/v2/paddle.js'
const TOKEN = import.meta.env.VITE_PADDLE_CLIENT_TOKEN
const ENVIRONMENT = import.meta.env.VITE_PADDLE_ENV ?? 'sandbox'

// 이 프로젝트에서 쓰는 Paddle 기능만 타입으로 정의
type PaddleEvent = { name?: string }
type PaddleSdk = {
  Environment: { set: (environment: string) => void }
  Initialize: (options: { token: string; eventCallback: (event: PaddleEvent) => void }) => void
  Checkout: {
    open: (options: {
      items: { priceId: string; quantity: number }[]
      customData: Record<string, string>
      settings: { displayMode: 'overlay'; locale: string; theme: 'light' }
    }) => void
    close: () => void
  }
}

declare global {
  interface Window {
    Paddle?: PaddleSdk
  }
}

// 지금 열린 결제창의 이벤트를 받을 곳 (Paddle은 이벤트 콜백을 처음 한 번만 등록할 수 있음)
let currentListener: ((event: PaddleEvent) => void) | null = null
let loading: Promise<PaddleSdk | null> | null = null

// Paddle.js를 불러와서 초기화 (한 번만, 충전 화면에 들어올 때 미리 불러둠)
export const loadPaddle = () => {
  if (!TOKEN) return Promise.resolve(null)

  loading ??= new Promise((resolve) => {
    const ready = () => {
      const paddle = window.Paddle
      if (!paddle) return resolve(null)
      if (ENVIRONMENT === 'sandbox') paddle.Environment.set('sandbox')
      paddle.Initialize({ token: TOKEN, eventCallback: (event) => currentListener?.(event) })
      resolve(paddle)
    }
    if (window.Paddle) return ready()

    const script = document.createElement('script')
    script.src = SDK_URL
    script.onload = ready
    script.onerror = () => {
      loading = null // 다음에 다시 시도할 수 있게
      resolve(null)
    }
    document.head.append(script)
  })
  return loading
}

type CheckoutOptions = {
  priceId: string // 주문 생성 응답의 paddle_price_id
  orderId: string // 주문 생성 응답의 order_id
  onCompleted: () => void // 결제창에서 결제를 마쳤을 때
  onClosed: () => void // 결제를 마치지 않고 결제창을 닫았을 때
}

// 결제창 열기. Paddle을 못 불러오면 false
export const openPaddleCheckout = async ({ priceId, orderId, onCompleted, onClosed }: CheckoutOptions) => {
  const paddle = await loadPaddle()
  if (!paddle) return false

  let completed = false
  currentListener = (event) => {
    if (event.name === 'checkout.completed') {
      completed = true
      paddle.Checkout.close() // 결제창의 완료 화면 대신 우리 결제 완료 화면을 보여줌
      onCompleted()
    }
    if (event.name === 'checkout.closed') {
      currentListener = null
      if (!completed) onClosed()
    }
  }

  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData: { order_id: orderId },
    settings: { displayMode: 'overlay', locale: 'ko', theme: 'light' },
  })
  return true
}
