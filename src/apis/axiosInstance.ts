// 공통 axios 인스턴스! baseURL, 토큰, 토큰 재발급 등 모든 API 요청의 기본 설정을 담당

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { paths } from '../routes/paths'

const baseURL = import.meta.env.VITE_API_BASE_URL

// Content-Type은 axios가 알아서 정함 (객체 → JSON, FormData → multipart)
const axiosInstance = axios.create({ baseURL })

// 요청 보내기 전: 로그인돼 있으면 Authorization 헤더에 토큰 붙이기
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// 토큰이 필요 없는 로그인 관련 주소는 401이 와도 재발급하지 않음
const AUTH_URLS = ['/api/accounts/kakao/', '/api/accounts/token/refresh/']

// 재발급 요청이 동시에 여러 번 나가지 않도록 진행 중인 요청을 공유
let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async () => {
  const { refreshToken, setAccessToken } = useAuthStore.getState()
  if (!refreshToken) throw new Error('refresh 토큰 없음')

  // 인터셉터가 다시 끼어들지 않도록 axiosInstance 대신 기본 axios 사용
  const { data } = await axios.post<{ access: string }>(`${baseURL}/api/accounts/token/refresh/`, {
    refresh: refreshToken,
  })
  setAccessToken(data.access)
  return data.access
}

// 재시도한 요청인지 표시하기 위한 타입 (무한 재시도 방지)
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// 응답 받은 후: 401(토큰 만료)이면 토큰 재발급 후 원래 요청 한 번 더 보내기
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    const isAuthUrl = AUTH_URLS.some((url) => config?.url?.startsWith(url))

    if (error.response?.status !== 401 || !config || config._retry || isAuthUrl) {
      return Promise.reject(error)
    }
    config._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const access = await refreshPromise
      config.headers.Authorization = `Bearer ${access}`
      return axiosInstance(config)
    } catch {
      // 재발급도 실패하면 (refresh 토큰 만료 등) 로그아웃 후 로그인 화면으로
      useAuthStore.getState().logout()
      if (window.location.pathname !== paths.login) window.location.replace(paths.login)
      return Promise.reject(error)
    }
  },
)

export default axiosInstance
