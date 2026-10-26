// .env 환경변수 타입
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_KAKAO_JS_KEY?: string // 카카오 JavaScript 키
  readonly VITE_PADDLE_CLIENT_TOKEN?: string // Paddle 결제창 client-side 토큰
  readonly VITE_PADDLE_ENV?: 'sandbox' | 'production' // 지금은 sandbox (심사 통과 후 production)
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
