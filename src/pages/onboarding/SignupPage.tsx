// 회원가입 - 약관 동의 페이지 (카카오 로그인 후 신규 회원일 때)
// 세 항목 모두 동의해야 '동의하고 회원가입하기' 활성화

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../../assets/onboarding/signup/logo.svg'
import checkAllOff from '../../assets/onboarding/signup/check-all-off.svg'
import checkAllOn from '../../assets/onboarding/signup/check-all-on.svg'
import checkOff from '../../assets/onboarding/signup/check-off.svg'
import checkOn from '../../assets/onboarding/signup/check-on.svg'
import divider from '../../assets/onboarding/signup/divider.svg'
import underline from '../../assets/onboarding/signup/underline.svg'
import info from '../../assets/onboarding/signup/info.svg'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import { AGREEMENTS, type AgreementKey, type TermsKey } from './terms'
import TermsDetail from './TermsDetail'

type Agreements = Record<AgreementKey, boolean>

const NONE_AGREED: Agreements = { terms: false, privacy: false, age_14: false }
const ALL_AGREED: Agreements = { terms: true, privacy: true, age_14: true }

// 주소의 ?terms= 값이 올바른 약관인지 확인
const isTermsKey = (value: string | null): value is TermsKey => value === 'terms' || value === 'privacy'

function SignupPage() {
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState<Agreements>(NONE_AGREED)

  // 약관 상세는 주소(?terms=terms)로 열어서, 휴대폰 뒤로가기로도 닫히게 함
  // 같은 페이지 안이라 체크 상태는 그대로 유지
  const [searchParams, setSearchParams] = useSearchParams()
  const openedTerms = searchParams.get('terms')
  const closeTerms = useGoBack(paths.signup)

  // 개별 항목이 모두 체크되면 '모두 동의하기'도 자동으로 체크
  const allAgreed = AGREEMENTS.every(({ key }) => agreements[key])

  const toggleAll = () => setAgreements(allAgreed ? NONE_AGREED : ALL_AGREED)
  const toggle = (key: AgreementKey) => setAgreements((prev) => ({ ...prev, [key]: !prev[key] }))

  // TODO: API 연동 시 kakaoSignup(signup_token + 동의 항목) 호출 후 토큰 저장
  const handleSignup = () => navigate(paths.home, { replace: true })

  if (isTermsKey(openedTerms)) {
    return (
      <TermsDetail
        termsKey={openedTerms}
        onAgree={() => {
          setAgreements((prev) => ({ ...prev, [openedTerms]: true }))
          closeTerms()
        }}
      />
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-bg text-white-100">
      <img src={logo} alt="달판" className="mx-auto mt-8 block max-w-none" />
      <h1 className="text-h2-semibold mt-3.25 px-6">
        서비스 이용을
        <br />
        위해 약관에 동의해주세요
      </h1>

      {/* 아래 영역은 화면 맨 아래에 붙임 */}
      <div className="mt-auto pt-10">
        <button
          type="button"
          role="checkbox"
          aria-checked={allAgreed}
          onClick={toggleAll}
          className="mx-6 flex cursor-pointer items-center gap-3.5"
        >
          <img src={allAgreed ? checkAllOn : checkAllOff} alt="" className="block max-w-none" />
          <span className={`text-b1-semibold transition-colors ${allAgreed ? 'text-keycolor-5' : 'text-gray-30'}`}>
            모두 동의하기
          </span>
        </button>

        <img src={divider} alt="" className="mx-auto mt-4 block max-w-none" />

        <ul className="mt-2.75 flex flex-col gap-4 px-7.5">
          {AGREEMENTS.map(({ key, label, name, hasDetail }) => (
            <li key={key} className="flex items-center justify-between">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreements[key]}
                onClick={() => toggle(key)}
                className="flex cursor-pointer items-center gap-4.75"
              >
                <img src={agreements[key] ? checkOn : checkOff} alt="" className="block max-w-none" />
                <span className="text-b3-medium text-keycolor-5">{label}</span>
              </button>
              {hasDetail && (
                <button
                  type="button"
                  aria-label={`${name} 보기`}
                  onClick={() => setSearchParams({ terms: key })}
                  className="text-l2-medium relative cursor-pointer text-gray-30"
                >
                  보기
                  <img src={underline} alt="" className="absolute top-4 left-0 block max-w-none" />
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 flex w-fit items-center gap-2.5 rounded-lg bg-[#3b3d56] px-5 py-2.5">
          <img src={info} alt="" className="block max-w-none" />
          <p className="text-l2-regular w-70.25 text-gray-30">
            동의 항목은 계정 정보에 저장되며, 약관이 개정되면 다시 동의를 받아요.
          </p>
        </div>

        <div className="px-6 pt-3.25 pb-9">
          <button
            type="button"
            disabled={!allAgreed}
            onClick={handleSignup}
            className="text-b1-semibold h-12.5 w-full cursor-pointer rounded-lg bg-keycolor-100 text-white-100 transition-[scale,color,background-color] duration-200 ease-out enabled:hover:scale-[1.03] disabled:cursor-default disabled:bg-gray-70 disabled:text-gray-40 motion-reduce:transition-none"
          >
            동의하고 회원가입하기
          </button>
        </div>
      </div>
    </main>
  )
}

export default SignupPage
