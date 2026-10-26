// 계정 API: 카카오 로그인, 회원가입, 로그아웃, 내 정보, 회원 탈퇴

import axiosInstance from './axiosInstance'
import type { KakaoLoginResponse, KakaoSignupRequest, KakaoSignupResponse, Me } from '../types/account'

// 카카오 인가 코드로 로그인 (redirect_uri는 카카오에 요청할 때 쓴 주소와 같아야 함)
export const kakaoLogin = async (code: string, redirectUri: string) => {
  const { data } = await axiosInstance.post<KakaoLoginResponse>('/api/accounts/kakao/login/', {
    code,
    redirect_uri: redirectUri,
  })
  return data
}

// 신규 회원 약관 동의 후 가입
export const kakaoSignup = async (body: KakaoSignupRequest) => {
  const { data } = await axiosInstance.post<KakaoSignupResponse>('/api/accounts/kakao/signup/', body)
  return data
}

// 로그아웃 (서버에서 refresh 토큰 폐기)
export const logout = async (refresh: string) => {
  await axiosInstance.post('/api/accounts/logout/', { refresh })
}

export const getMe = async () => {
  const { data } = await axiosInstance.get<Me>('/api/accounts/me/')
  return data
}

// 회원 탈퇴
export const withdraw = async () => {
  await axiosInstance.post('/api/accounts/withdraw/', { confirm: true })
}
