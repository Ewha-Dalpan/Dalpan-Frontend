// 코인 충전 결제(Paddle) API 타입

export type CoinProduct = {
  id: number
  name: string
  coin_amount: number // 받는 코인 수
  price_krw: number // 가격(원)
}

export type CreateOrderResponse = {
  order_id: string // UUID, Paddle 결제창 customData.order_id로 넘겨야 코인 지급됨
  paddle_price_id: string
  coin_amount: number
  price_krw: number
}

export type OrderStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED'

export type Order = {
  order_id: string
  status: OrderStatus
  coin_amount: number
  paid_at: string | null
}
