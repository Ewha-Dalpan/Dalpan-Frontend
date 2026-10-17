// 배심원석 API: 공개 사건 목록, 상세, 투표, 댓글, 신고

import axiosInstance from './axiosInstance'
import type { Paginated } from '../types/common'
import type {
  JuryCaseDetail,
  JuryCaseListItem,
  JuryComment,
  JuryRelation,
  JurySort,
  JuryVoteResponse,
  ReportRequest,
} from '../types/jury'

export const getJuryCases = async (params: { page?: number; relation?: JuryRelation; sort?: JurySort } = {}) => {
  const { data } = await axiosInstance.get<Paginated<JuryCaseListItem>>('/api/jury/cases/', { params })
  return data
}

export const getJuryCase = async (caseId: number) => {
  const { data } = await axiosInstance.get<JuryCaseDetail>(`/api/jury/cases/${caseId}/`)
  return data
}

// TODO: 투표 요청 body 구조 확인 필요 (명세서 상세 비어 있음)
export const voteJuryCase = async (caseId: number, body: Record<string, unknown>) => {
  const { data } = await axiosInstance.post<JuryVoteResponse>(`/api/jury/cases/${caseId}/votes/`, body)
  return data
}

export const getJuryComments = async (caseId: number, page = 1) => {
  const { data } = await axiosInstance.get<Paginated<JuryComment>>(`/api/jury/cases/${caseId}/comments/`, {
    params: { page },
  })
  return data
}

export const createJuryComment = async (caseId: number, content: string) => {
  const { data } = await axiosInstance.post<JuryComment>(`/api/jury/cases/${caseId}/comments/`, { content })
  return data
}

export const deleteJuryComment = async (caseId: number, commentId: number) => {
  await axiosInstance.delete(`/api/jury/cases/${caseId}/comments/${commentId}/`)
}

// 공개 사건 이미지 (로그인 없이 볼 수 있어서 <img src>에 바로 사용 가능)
export const getJuryImageUrl = (imageId: number) => `${import.meta.env.VITE_API_BASE_URL}/api/jury/images/${imageId}/`

export const reportJuryCase = async (caseId: number, body: ReportRequest) => {
  await axiosInstance.post(`/api/jury/cases/${caseId}/reports/`, body)
}
