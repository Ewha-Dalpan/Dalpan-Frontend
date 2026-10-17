// 판결 API: 진행 상태, 판결 결과, 공유 링크, 배심원석 공개

import axiosInstance from './axiosInstance'
import type { PublicVerdict, PublishResponse, ShareLink, Verdict, VerdictRequest } from '../types/verdict'

// 분석 · 판결 진행 상태 (로딩 화면에서 주기적으로 조회)
export const getVerdictRequest = async (requestId: number) => {
  const { data } = await axiosInstance.get<VerdictRequest>(`/api/verdicts/requests/${requestId}/`)
  return data
}

export const getVerdict = async (caseId: number) => {
  const { data } = await axiosInstance.get<Verdict>(`/api/verdicts/cases/${caseId}/`)
  return data
}

// 공유 링크 만들기 / 끊기
export const createShareLink = async (caseId: number) => {
  const { data } = await axiosInstance.post<ShareLink>(`/api/verdicts/cases/${caseId}/share/`)
  return data
}

export const deleteShareLink = async (caseId: number) => {
  await axiosInstance.delete(`/api/verdicts/cases/${caseId}/share/`)
}

// 공유 받은 판결 (로그인 없이 볼 수 있음)
export const getSharedVerdict = async (token: string) => {
  const { data } = await axiosInstance.get<PublicVerdict>(`/api/verdicts/shared/${token}/`)
  return data
}

// 배심원석에 공개 / 공개 취소
export const publishVerdict = async (caseId: number) => {
  const { data } = await axiosInstance.post<PublishResponse>(`/api/verdicts/cases/${caseId}/publish/`)
  return data
}

export const unpublishVerdict = async (caseId: number) => {
  await axiosInstance.delete(`/api/verdicts/cases/${caseId}/publish/`)
}
