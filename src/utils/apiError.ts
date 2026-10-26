// API 에러를 화면에 보여줄 한 줄 메시지로 바꾸기

import { isAxiosError } from 'axios'

const DEFAULT_MESSAGE = '잠시 후 다시 시도해 주세요.'

// 문자열 또는 문자열 배열 안의 첫 메시지 꺼내기
const firstMessage = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return firstMessage(value[0])
  return null
}

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_MESSAGE) => {
  if (!isAxiosError(error)) return fallback
  if (!error.response) return '인터넷 연결을 확인해 주세요.'

  const data: unknown = error.response.data
  if (typeof data === 'string') return fallback // HTML 에러 페이지 등은 그대로 보여주지 않음
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    // detail이 있으면 우선, 없으면 첫 번째 필드 에러
    const message = firstMessage(record.detail) ?? Object.values(record).map(firstMessage).find(Boolean)
    if (message) return message
  }
  return fallback
}

// 백엔드가 보내는 에러 코드
export const getApiErrorCode = (error: unknown) => {
  if (!isAxiosError(error)) return null
  const data: unknown = error.response?.data
  if (data && typeof data === 'object' && 'code' in data && typeof data.code === 'string') return data.code
  return null
}

// 특정 상태 코드인지 확인
export const isApiStatus = (error: unknown, status: number) =>
  isAxiosError(error) && error.response?.status === status
