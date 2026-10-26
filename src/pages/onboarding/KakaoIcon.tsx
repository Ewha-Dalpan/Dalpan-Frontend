import kakao from '../../assets/onboarding/kakao.png'

// className으로 크기 변경 가능 (기본: 로그인 버튼용 22×24)
function KakaoIcon({ className = 'h-6 w-5.5' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative block shrink-0 overflow-hidden ${className}`}>
      <img src={kakao} alt="" className="absolute left-[-1.66%] top-0 h-full w-[285.46%] max-w-none" />
    </span>
  )
}

export default KakaoIcon
