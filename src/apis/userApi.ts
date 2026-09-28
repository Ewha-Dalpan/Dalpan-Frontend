// 사용자 관련 API 요청 함수 모음
// 주소 임시로 적어놨는데, 나중에 백엔드 API 명세서 나오면 수정해야함!!

import axiosInstance from './axiosInstance'

export const getMe = async () => {
  const { data } = await axiosInstance.get('/users/me')
  return data
}
