// 사건/판결 결과 등 여러 곳에서 공통으로 쓰는 타입 정의
// 필드 임시로 넣은 거라 나중에 백엔드 API 명세서 나오면 수정

export interface Case {
  id: number
}

export interface JudgmentResult {
  caseId: number
}
