// 운영자 정보 (약관 · 정책 · 페이지 하단에 같이 씀)

export const OPERATOR = {
  service: '달판(Dalpan)',
  serviceEn: 'Dalpan',
  name: 'JIMIN SHIN',
  email: 'team.dalpan@gmail.com',
} as const

// 약관 · 정책 시행일
export const POLICY_EFFECTIVE_DATE = '2026년 11월 2일'
export const POLICY_EFFECTIVE_DATE_EN = 'November 2, 2026'

// 서비스 안내 · 정책 페이지 언어 (영문 버전도 둠)
export type PolicyLang = 'ko' | 'en'
