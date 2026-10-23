// 충전 상품 표시용 공통 값 (이용권 충전 화면, 서비스 안내 화면에서 같이 씀)

// 백엔드는 보너스를 합친 전체 톨 수만 줌 (예: 11톨)
// 피그마처럼 '10톨 + 1톨 보너스'로 나눠 보여주려고 전체 톨 수별 보너스를 적어둠
export const BONUS_BY_TOTAL: Record<number, number> = { 11: 1, 23: 3, 55: 5 }

export const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`
