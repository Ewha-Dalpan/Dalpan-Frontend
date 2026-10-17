// 여러 API에서 같이 쓰는 응답 모양

// 페이지 단위로 나눠서 받는 목록 (내 사건, 배심원석, 댓글, 코인 내역 등)
export type Paginated<T> = {
  count: number // 전체 개수
  next: string | null // 다음 페이지 주소 (없으면 null)
  previous: string | null // 이전 페이지 주소 (없으면 null)
  results: T[]
}
