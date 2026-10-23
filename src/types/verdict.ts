// 판결(분석 요청 상태, 최종 판결, 공유, 배심원 공개) API 타입

// 분석/판결 요청 상태
// 대기 → 처리 중 → (분석 끝) 사용자 확인 대기 → (판결 끝) 완료 / 실패 / 취소
export type RequestStatus = 'PENDING' | 'RUNNING' | 'AWAITING_CONFIRMATION' | 'DONE' | 'FAILED' | 'CANCELED'

// 지금 어느 작업 중인지 (판결 로딩 문구에 사용)
export type ProgressStep =
  | 'ANALYZING_IMAGES' // 이미지 분석
  | 'WAITING_CONFIRMATION' // 사용자 상황 확인 대기
  | 'PLANNING_FACTORS' // 판단 요소 구성
  | 'SEARCHING_SCHOLAR' // 논문 검색
  | 'REVIEWING_SOURCES' // 참고 출처 검토
  | 'SEARCHING_WEB' // 기사 검색
  | 'GENERATING_JUDGMENT' // 판결 생성
  | 'DONE'
  | 'FAILED'
  | 'CANCELED'

export type VerdictRequest = {
  id: number // 상태 조회에 쓰는 요청 ID
  case_id: number
  stage: 'ANALYSIS' | 'JUDGMENT' // 대화 분석 단계 / 판결 단계
  status: RequestStatus
  progress_step: ProgressStep | null
  error_message: string | null // 실패 사유
  created_at: string
  started_at: string | null
  finished_at: string | null
  verdict: Verdict | null // DONE일 때만 들어옴
}

// 판단 근거로 참고한 논문·기사
export type VerdictSource = {
  kind: 'SCHOLAR' | 'WEB' // 논문 / 기사
  title: string
  url: string // 원문 링크
  publisher: string // 빈 문자열일 수 있음
  authors: string[] // 빈 배열일 수 있음
  published_date: string // 빈 문자열일 수 있음
  reference_summary: string // 이 자료를 판단에 참고한 이유
}

// 공개용 판단 요소 (공유, 배심원석에서 사용, 익명화됨)
export type PublicFactor = {
  id: number
  side: 'SELF' | 'OTHER' // 나 / 상대
  name: string // 과실 키워드
  summary: string // 판단 이유
  can_expand: boolean // 참고 출처가 있으면 true ('왜 이게 판단 기준인가요?' 표시 여부)
  source: VerdictSource | null
}

// 개인용 판단 요소 (본인만 볼 수 있음)
export type VerdictFactor = PublicFactor & {
  key: string // 내부 식별 키
  evidence: number[] // 근거가 된 대화 순서 (0부터)
}

// 공개용 판결 (공유 받은 화면, 공유 링크 생성 응답, 배심원 공개 응답)
export type PublicVerdict = {
  case_id: number
  case_number: string // 예: 제00001호
  title: string
  relation: string
  case_summary: string
  fault_ratio: number // 내 과실 비율 0~100
  other_fault_ratio: number // 상대 과실 비율 (100 - fault_ratio)
  one_line: string // 한 줄 결과 (예: 상대 쪽으로 저울이 기울었어요.)
  self_factors: PublicFactor[]
  other_factors: PublicFactor[]
}

// 최종 판결 (본인용)
export type Verdict = {
  id: number
  case_id: number
  case_number: string
  title: string
  relation: string
  fault_ratio: number
  other_fault_ratio: number
  one_line: string | null
  case_summary: string | null
  judgment_text: string // 전체 판결 설명
  recommendation: string | null
  recommended_reply: string // 추천 답장
  self_factors: VerdictFactor[] // 한쪽은 빈 배열일 수 있음
  other_factors: VerdictFactor[]
  reasons: string[]
  public_preview: PublicVerdict // 공유 · 공개 전에 보여줄 공개용 데이터
  is_public: boolean // 배심원석 공개 여부
  created_at: string
}

export type ShareLink = {
  token: string // 공유 토큰 (UUID)
  share_url: string // 프론트 공유 화면 주소 (/shared/{token})
  share_api_url: string
  verdict: PublicVerdict
}

export type PublishResponse = {
  case_id: number
  is_public: boolean
  verdict: Pick<PublicVerdict, 'case_id' | 'case_number' | 'title' | 'relation' | 'case_summary' | 'fault_ratio' | 'other_fault_ratio'>
}
