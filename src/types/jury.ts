// 배심원석(목록, 상세, 투표, 댓글, 신고) API 타입
// TODO: 명세서 상세 페이지가 비어 있어서, 안쪽 구조를 모르는 필드는 unknown으로 둠 (확정되면 수정)

// 배심원석 관계 필터 값 (사건 생성 값 '학교·팀플'과 달라서 백엔드와 통일 필요)
export type JuryRelation = '연애' | '친구' | '가족' | '직장·학교' | '기타'

export type JurySort = 'latest' | 'popular' // 최신순 / 배심원 많은 순

export type JuryCaseListItem = {
  case_id: number
  relation: string
  title: string
  jury_count: number // 참여한 배심원 수
  comment_count: number
  public_at: string // 공개된 시각
  thumbnail: unknown // TODO: 구조 확인 필요
}

export type JuryCaseDetail = {
  case_id: number
  relation: string
  title: string
  summary: string
  images: unknown[] // TODO: 구조 확인 필요 (이미지 id 등)
  public_at: string
  is_author: boolean // 내가 올린 사건인지
  can_vote: boolean
  can_view_result: boolean
  my_vote: unknown // TODO: 구조 확인 필요
  result: unknown // TODO: 구조 확인 필요 (투표했거나 작성자일 때만, 그 외 null)
  jury_count: number
  comment_count: number
}

export type JuryVoteResponse = {
  my_vote: unknown // TODO: 구조 확인 필요
  result: unknown // TODO: 구조 확인 필요
  jury_count: number
  coin_rewarded: boolean // 코인 지급 여부 (하루 5회 넘으면 false)
}

export type JuryComment = {
  id: number
  nickname: string
  content: string
  created_at: string
  is_mine: boolean
}

export type ReportReason = 'ABUSE' | 'PRIVACY' | 'SPAM' | 'OTHER'

export type ReportRequest = {
  reason: ReportReason
  detail?: string // 최대 500자, OTHER면 필수
}
