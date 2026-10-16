// 카카오톡 공유 (카카오 JavaScript SDK)

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js'
const SDK_INTEGRITY = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy'
const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY

// 이 프로젝트에서 쓰는 SDK 기능만 타입으로 정의
type KakaoSdk = {
  init: (key: string) => void
  isInitialized: () => boolean
  Share: { sendDefault: (settings: object) => void }
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
