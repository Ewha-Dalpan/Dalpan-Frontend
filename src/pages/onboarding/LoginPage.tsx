import { useState } from 'react'
import Button from '../../components/Button'
import logo from '../../assets/onboarding/splash-logo.svg'
import ground from '../../assets/onboarding/splash-ground.svg'
import rabbits from '../../assets/onboarding/splash-rabbits.png'
import KakaoIcon from './KakaoIcon'

function LoginPage() {
  const [message, setMessage] = useState('')
  return (
    <main className="relative mx-auto min-h-[max(798px,100dvh)] w-full max-w-[393px] overflow-hidden bg-bg text-white-100">
      <img src={logo} alt="달판" className="absolute left-1/2 top-[73px] block max-w-none -translate-x-1/2" />
      <img src={ground} alt="" className="pointer-events-none absolute left-full top-[452.11px] block max-w-none -translate-x-1/2" />
      <img src={rabbits} alt="" className="pointer-events-none absolute left-[13px] top-[298px] h-[416.111px] w-[743.943px] max-w-none object-cover" />
      <h1 className="absolute left-[calc(50%-2.5px)] top-[223px] -translate-x-1/2 whitespace-nowrap text-[20px] font-bold leading-[1.5] tracking-[-0.03em]">내가 예민한 걸까?</h1>
      <p className="text-b2-medium absolute left-[calc(50%-2.5px)] top-[258px] -translate-x-1/2 whitespace-nowrap text-center">헷갈리는 관계 속 갈등,<br />달판이 상황과 대화를 보고 판결해드려요.</p>
      <Button onClick={() => setMessage('카카오 로그인 기능은 준비 중이에요.')} className="text-b1-semibold absolute left-[23px] right-[25px] top-[674px] flex h-[50px] cursor-pointer items-center justify-center overflow-hidden rounded-[8px] bg-[#fbe84c] text-black">
        <span className="flex -translate-x-[0.5px] items-end gap-[11px]"><KakaoIcon />카카오로 계속하기</span>
      </Button>
      <p role="status" className="text-l1-regular absolute inset-x-[23px] top-[736px] text-center text-white-100">{message}</p>
    </main>
  )
}

export default LoginPage
