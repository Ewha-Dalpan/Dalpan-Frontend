// 계정(로그인, 회원가입, 내 정보) API 타입

// 카카오 로그인 응답: 기존 회원이면 바로 로그인, 신규 회원이면 약관 동의가 필요
export type KakaoLoginResponse =
  | { status: 'LOGIN'; access: string; refresh: string; user: { nickname: string } }
  | { status: 'NEED_CONSENT'; signup_token: string }

// 약관 동의 회원가입 요청 (세 동의 모두 true여야 함)
export type KakaoSignupRequest = {
  signup_token: string
  terms: boolean // 서비스 이용약관
  privacy: boolean // 개인정보 수집/이용
  age_14: boolean // 만 14세 이상
}

// 회원가입 응답 (로그인 응답과 같은 모양)
export type KakaoSignupResponse = Extract<KakaoLoginResponse, { status: 'LOGIN' }>

export type Me = {
  nickname: string
  joined_at: string
  coin_balance: number // 보유 코인(톨)
}
