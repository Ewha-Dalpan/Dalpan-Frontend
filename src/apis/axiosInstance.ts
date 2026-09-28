// 공통 axios 인스턴스! baseURL, 헤더 등 모든 API 요청의 기본 설정을 담당

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default axiosInstance
