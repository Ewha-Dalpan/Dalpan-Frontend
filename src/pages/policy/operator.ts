// 운영자 정보 (약관 · 정책 · 페이지 하단에 같이 씀)
// Paddle 심사: 약관의 운영자 이름이 Paddle 계정에 등록한 이름과 똑같아야 함

export const OPERATOR = {
  service: '달판(Dalpan)',
  serviceEn: 'Dalpan',
  name: 'JIMIN SHIN',
  email: 'team.dalpan@gmail.com',
} as const

// 약관 · 정책 시행일
export const POLICY_EFFECTIVE_DATE = '2026년 10월 23일'
export const POLICY_EFFECTIVE_DATE_EN = 'October 23, 2026'

// 서비스 안내 · 정책 페이지 언어 (Paddle 심사팀이 해외에 있어서 영문 버전도 둠)
export type PolicyLang = 'ko' | 'en'
