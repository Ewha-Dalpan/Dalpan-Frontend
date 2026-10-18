// 사건(대화 캡처 접수, 상황 확인) API 타입

import type { VerdictRequest } from './verdict'

// 상대와의 관계 값 (사건 접수 · 배심원석 필터 공통, 가운뎃점은 '·')
export const RELATIONS = ['연애', '친구', '가족', '직장·학교', '기타'] as const
export type CaseRelation = (typeof RELATIONS)[number]

// 사건 진행 상태: 작성 중 → 상황 확인 중 → 판결 대기 → 판결 중 → 판결 완료
export type CaseStatus = 'WRITING' | 'CONFIRMING' | 'READY' | 'JUDGING' | 'JUDGED'

// 내가 대화에서 왼쪽 말풍선인지 오른쪽 말풍선인지 (기본 RIGHT)
export type SpeakerSide = 'LEFT' | 'RIGHT'

export type CaseImage = {
  id: number
  image_key: string // 로그인이 필요한 이미지 조회 주소 (공개 주소 아님)
  sort_order: number // 0부터 시작
}

export type CaseSituation = {
  relation: string | null
  user_speaker_side: SpeakerSide
  summary: string | null // AI 요약 또는 사용자가 고친 요약
  analysis_status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED'
  confirmed_at: string | null
}

export type Case = {
  id: number
  title: string | null
  status: CaseStatus
  created_at: string
  updated_at: string
  images: CaseImage[]
  situation: CaseSituation | null
  conflict_core: string | null // 갈등 핵심 (수정 불가)
}

export type CreateCaseRequest = {
  relation: CaseRelation
  images: File[] // 1~6장
}

export type CreateCaseResponse = {
  case_id: number
  verdict_request: VerdictRequest
}

export type CasePayment = {
  balance: number // 보유 코인
  cost: number // 접수 비용 (진행 중인 요청이 있으면 0)
  can_submit: boolean
}

export type UpdateSituationRequest = {
  summary?: string
  user_speaker_side?: SpeakerSide
}
