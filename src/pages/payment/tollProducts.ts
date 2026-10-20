// 톨 충전 상품 
// TODO: 결제 API 연동 시 상품 목록 API(GET /api/payments/products/)로 교체

export type TollProduct = {
  id: number
  coins: number // 받는 톨
  bonus?: number // 보너스 톨
  price: number // 가격(원)
}

// 인기 상품 (맨 위 고정)
export const POPULAR_PRODUCT: TollProduct = { id: 2, coins: 10, price: 8000 }

// 전체 상품
export const ALL_PRODUCTS: TollProduct[] = [
  { id: 1, coins: 5, price: 4000 },
  { id: 2, coins: 10, price: 8000 },
  { id: 3, coins: 20, price: 16000 },
  { id: 4, coins: 50, bonus: 5, price: 40000 },
]
