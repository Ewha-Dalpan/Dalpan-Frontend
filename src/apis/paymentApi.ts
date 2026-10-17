// 결제 API: 코인 상품, 주문 생성, 주문 상태 (Paddle 결제창과 함께 사용)

import axiosInstance from './axiosInstance'
import type { CoinProduct, CreateOrderResponse, Order } from '../types/payment'

export const getCoinProducts = async () => {
  const { data } = await axiosInstance.get<CoinProduct[]>('/api/payments/products/')
  return data
}

// 주문 만들기 → 받은 order_id를 Paddle 결제창에 넘김
export const createOrder = async (productId: number) => {
  const { data } = await axiosInstance.post<CreateOrderResponse>('/api/payments/orders/', { product_id: productId })
  return data
}

// 결제 후 코인이 들어왔는지 확인
export const getOrder = async (orderId: string) => {
  const { data } = await axiosInstance.get<Order>(`/api/payments/orders/${orderId}/`)
  return data
}
