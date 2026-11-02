// 이용권 충전 결제(PayApp) API 타입

export type CoinProduct = {
  id: number
  code: string | null
  name: string
  coin_amount: number // 실제 지급 수량 (보너스 포함)
  base_coin_amount: number // 보너스를 뺀 기본 수량
  bonus_coin_amount: number
  price_krw: number // 가격(원)
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED'

export type CreateOrderResponse = {
  order_id: string // UUID
  provider: string
  pay_url: string // 이동할 PayApp 결제창 주소
  status: OrderStatus
  coin_amount: number
  price_krw: number
}

export type Order = {
  order_id: string
  status: OrderStatus
  coin_amount: number
  paid_at: string | null
  provider: string // payapp 또는 예전 주문의 paddle
  pay_url: string // PENDING이 아니면 빈 문자열
}
