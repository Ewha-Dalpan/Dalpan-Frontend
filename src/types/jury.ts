import type { CaseRelation } from './case'

export type JuryRelation = CaseRelation

export type JurySort = 'latest' | 'popular'

export type JuryCaseListItem = {
  case_id: number
  relation: string
  title: string
  jury_count: number
  comment_count: number
  public_at: string
  thumbnail: string | null
}

export type JuryRatio = {
  author: number
  other: number
}

export type JuryVoteRequest = {
  fault_ratio: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
}

export type JuryCaseDetail = {
  case_id: number
  relation: string
  title: string
  summary: string
  images: string[]
  public_at: string
  is_author: boolean
  can_vote: boolean
  can_view_result: boolean
  my_vote: JuryRatio | null
  result: JuryRatio | null
  jury_count: number
  comment_count: number
}

export type JuryVoteResponse = {
  my_vote: JuryRatio
  result: JuryRatio | null
  jury_count: number
  coin_rewarded: boolean
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
  detail?: string
}

export type JuryActivity = {
  case_id: number
  title: string
  relation: string
  has_voted: boolean
  my_fault_ratio: number | null
  my_comment_count: number
  last_activity_at: string
  thumbnail: string | null
}
