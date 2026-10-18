// 카카오톡 공유 / 카카오 로그인 (카카오 JavaScript SDK)

import { paths } from '../routes/paths'

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js'
const SDK_INTEGRITY = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy'
const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY

// 이 프로젝트에서 쓰는 SDK 기능만 타입으로 정의
type KakaoSdk = {
  init: (key: string) => void
  isInitialized: () => boolean
  Share: { sendDefault: (settings: object) => void }
  Auth: { authorize: (settings: { redirectUri: string; state?: string }) => void }
}

declare global {
  interface Window {
    Kakao?: KakaoSdk
  }
}

let loading: Promise<KakaoSdk | null> | null = null

// SDK를 불러와서 앱 키로 초기화 (한 번만, 공유 모달을 열 때 미리 불러둠)
export const loadKakao = () => {
  if (!KAKAO_KEY) return Promise.resolve(null)

  loading ??= new Promise((resolve) => {
    const ready = () => {
      const kakao = window.Kakao
      if (!kakao) return resolve(null)
      if (!kakao.isInitialized()) kakao.init(KAKAO_KEY)
      resolve(kakao)
    }
    if (window.Kakao) return ready()

    const script = document.createElement('script')
    script.src = SDK_URL
    script.integrity = SDK_INTEGRITY
    script.crossOrigin = 'anonymous'
    script.onload = ready
    script.onerror = () => {
      loading = null // 다음에 다시 시도할 수 있게
      resolve(null)
    }
    document.head.append(script)
  })
  return loading
}

// 카카오톡으로 바로 보내기. SDK가 준비 안 됐으면 false
// (PC에서는 새 창이 떠서 팝업 차단을 피하려면 클릭 직후 바로 불러야 함 → 미리 loadKakao 해두기)
export const shareToKakao = ({ url, text }: { url: string; text: string }) => {
  const kakao = window.Kakao
  if (!kakao?.isInitialized()) return false
  try {
    // TODO: 공유 이미지를 서버에 올릴 수 있게 되면 이미지가 들어간 'feed' 템플릿으로 바꾸기
    kakao.Share.sendDefault({
      objectType: 'text',
      text,
      link: { mobileWebUrl: url, webUrl: url },
      buttonTitle: '판결문 보기',
    })
    return true
  } catch {
    return false
  }
}

// 카카오 로그인 후 돌아올 주소
export const KAKAO_REDIRECT_URI = `${window.location.origin}${paths.kakaoCallback}`

// 카카오 로그인 화면으로 이동. returnTo: 로그인 후 돌아갈 화면 (state로 보냈다가 콜백에서 다시 받음)
export const startKakaoLogin = async (returnTo?: string) => {
  const kakao = await loadKakao()
  if (!kakao) return false
  try {
    // state 값이 비어 있으면 SDK가 에러를 내서, 돌아갈 화면이 있을 때만 넣음
    kakao.Auth.authorize({ redirectUri: KAKAO_REDIRECT_URI, ...(returnTo && { state: returnTo }) })
    return true
  } catch {
    return false
  }
}
