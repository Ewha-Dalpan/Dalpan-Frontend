// .env 환경변수 타입
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_KAKAO_JS_KEY?: string // 카카오 JavaScript 키
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
