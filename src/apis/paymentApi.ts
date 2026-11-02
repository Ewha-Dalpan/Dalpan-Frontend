// 결제 API: 이용권 상품, 주문 생성, 주문 상태 (주문 생성 후 PayApp 결제창으로 이동)

import axiosInstance from './axiosInstance'
import type { CoinProduct, CreateOrderResponse, Order } from '../types/payment'

export const getCoinProducts = async () => {
  const { data } = await axiosInstance.get<CoinProduct[]>('/api/payments/products/')
  return data
}

type CreateOrderRequest = {
  productId: number
  recvphone: string // 구매자 휴대폰 번호 (01012345678)
  idempotencyKey: string // 같은 결제 시도를 다시 보내도 주문이 하나만 생기게 하는 UUID
}

// 주문 만들기 → 받은 pay_url로 이동하면 PayApp 결제창이 열림
export const createOrder = async ({ productId, recvphone, idempotencyKey }: CreateOrderRequest) => {
  const { data } = await axiosInstance.post<CreateOrderResponse>(
    '/api/payments/orders/',
    { product_id: productId, recvphone },
    { headers: { 'Idempotency-Key': idempotencyKey } },
  )
  return data
}

// 결제 완료 여부 확인
export const getOrder = async (orderId: string) => {
  const { data } = await axiosInstance.get<Order>(`/api/payments/orders/${orderId}/`)
  return data
}
