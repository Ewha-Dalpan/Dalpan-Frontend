// 카카오 로그인 콜백 (/oauth/kakao?code=...&state=...)
// 받은 인가 코드로 백엔드 로그인 → 기존 회원은 원래 화면으로, 신규 회원은 약관 동의 화면으로

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { kakaoLogin } from '../../apis/accountApi'
import loadingRabbit from '../../assets/judgment/loading.mp4'
import type { LoginLocationState } from '../../components/RequireAuth'
import { paths } from '../../routes/paths'
import { useAuthStore } from '../../store/useAuthStore'
import { getApiErrorMessage } from '../../utils/apiError'
import { KAKAO_REDIRECT_URI } from '../../utils/kakao'

// 약관 동의 화면으로 넘기는 state 모양 (SignupPage에서 꺼내 씀)
export type SignupLocationState = { signupToken: string } | null

// 인가 코드는 한 번만 쓸 수 있어서, 개발 모드에서 effect가 두 번 실행돼도 한 번만 요청
let requestedCode: string | null = null

// 다른 사이트로 튀지 않게 우리 사이트 안의 경로만 허용
const isSafePath = (path: string | null): path is string => !!path && path.startsWith('/') && !path.startsWith('//')

function KakaoCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useAuthStore((state) => state.login)

  useEffect(() => {
    const code = searchParams.get('code')
    const returnTo = searchParams.get('state')
    const goToLogin = (message?: string) => {
      navigate(paths.login, { replace: true, state: (message ? { message } : null) satisfies LoginLocationState })
    }

    // 사용자가 카카오 동의 화면에서 취소했거나 코드가 없으면 로그인 화면으로
    if (!code) {
      goToLogin()
      return
    }
    if (requestedCode === code) return
    requestedCode = code

    kakaoLogin(code, KAKAO_REDIRECT_URI)
      .then((data) => {
        if (data.status === 'LOGIN') {
          login({ access: data.access, refresh: data.refresh, nickname: data.user.nickname })
          navigate(isSafePath(returnTo) ? returnTo : paths.home, { replace: true })
        } else {
          navigate(paths.signup, { replace: true, state: { signupToken: data.signup_token } satisfies SignupLocationState })
        }
      })
      .catch((error: unknown) => goToLogin(getApiErrorMessage(error, '로그인에 실패했어요. 다시 시도해 주세요.')))
  }, [searchParams, navigate, login])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col items-center justify-center bg-bg pb-21 text-white-100">
      {/* AI 판결 로딩과 같은 토끼 그림 */}
      <video
        src={loadingRabbit}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        width={656}
        height={390}
        className="block h-auto w-63 [clip-path:inset(0_0_1px_0)]"
      />
      <p role="status" className="text-b2-medium mt-4.5">
        로그인하는 중이에요
      </p>
    </main>
  )
}

export default KakaoCallbackPage
