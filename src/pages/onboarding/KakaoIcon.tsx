import kakao from '../../assets/onboarding/kakao.png'

function KakaoIcon() {
  return (
    <span aria-hidden="true" className="relative block h-[24px] w-[22px] shrink-0 overflow-hidden">
      <img src={kakao} alt="" className="absolute left-[-1.66%] top-0 h-full w-[285.46%] max-w-none" />
    </span>
  )
}

export default KakaoIcon
