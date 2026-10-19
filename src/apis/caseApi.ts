// 사건 API: 내 사건 목록, 사건 접수, 상황 확인, 판결 요청

import axiosInstance from './axiosInstance'
import type { Paginated } from '../types/common'
import type { Case, CasePayment, CreateCaseRequest, CreateCaseResponse, UpdateSituationRequest } from '../types/case'
import type { VerdictRequest } from '../types/verdict'

// 내 사건 목록 (unfinished: true면 판결 안 끝난 사건만)
export const getCases = async (params: { page?: number; unfinished?: boolean } = {}) => {
  const { data } = await axiosInstance.get<Paginated<Case>>('/api/cases/', { params })
  return data
}

// 사건 접수: 대화 캡처를 올리면 1톨 차감 후 AI 분석 시작
export const createCase = async ({ relation, images }: CreateCaseRequest) => {
  const form = new FormData()
  form.append('relation', relation)
  images.forEach((image) => form.append('images', image))

  const { data } = await axiosInstance.post<CreateCaseResponse>('/api/cases/', form)
  return data
}

export const getCase = async (caseId: number) => {
  const { data } = await axiosInstance.get<Case>(`/api/cases/${caseId}/`)
  return data
}

// 사건 이미지는 로그인이 필요해서 <img src>에 바로 못 넣음 → blob으로 받아 URL.createObjectURL로 사용
export const getCaseImage = async (caseId: number, imageId: number) => {
  const { data } = await axiosInstance.get<Blob>(`/api/cases/${caseId}/images/${imageId}/`, { responseType: 'blob' })
  return data
}

// 이미 만든 사건을 다시 접수할 때 잔액 · 비용 확인 (진행 중인 요청이 있으면 비용 0)
export const getCasePayment = async (caseId: number) => {
  const { data } = await axiosInstance.get<CasePayment>(`/api/cases/${caseId}/payment/`)
  return data
}

export const submitCase = async (caseId: number) => {
  const { data } = await axiosInstance.post<VerdictRequest>(`/api/cases/${caseId}/submit/`)
  return data
}

// 상황 확인 화면에서 요약 · 말풍선 방향 수정
export const updateSituation = async (caseId: number, body: UpdateSituationRequest) => {
  const { data } = await axiosInstance.patch<Case>(`/api/cases/${caseId}/situation/`, body)
  return data
}

// 상황 확인 완료 → 최종 판결 요청
export const requestJudgment = async (caseId: number) => {
  const { data } = await axiosInstance.post<VerdictRequest>(`/api/cases/${caseId}/judgment/`)
  return data
}
