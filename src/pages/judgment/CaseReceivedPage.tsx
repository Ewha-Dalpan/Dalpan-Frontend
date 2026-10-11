// AI 재판 - 사건접수 로딩 페이지
// 업로드 → (결제) → 이 화면 5초 → AI 상황확인으로 자동 이동
// 모션넣음!! 토끼가 달 뒤에서 튀어 올라옴 → 귀 쫑긋, 달 회전, 별 반짝, 문구 떠오름

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import chair from '../../assets/judgment/received/chair.svg'
import desk from '../../assets/judgment/received/desk.svg'
import moon from '../../assets/judgment/received/moon.svg'
import moonCraters from '../../assets/judgment/received/moon-craters.svg'
import rabbitBody from '../../assets/judgment/received/rabbit-body.svg'
import rabbitCheeks from '../../assets/judgment/received/rabbit-cheeks.svg'
import rabbitEarLeft from '../../assets/judgment/received/rabbit-ear-left.svg'
import rabbitEarRight from '../../assets/judgment/received/rabbit-ear-right.svg'
import rabbitFace from '../../assets/judgment/received/rabbit-face.svg'
import rabbitGlasses from '../../assets/judgment/received/rabbit-glasses.svg'
import rabbitHands from '../../assets/judgment/received/rabbit-hands.svg'
import rabbitNose from '../../assets/judgment/received/rabbit-nose.svg'
import { paths } from '../../routes/paths'

// 이 화면을 보여주는 시간 (ms)
const LOADING_MS = 5000

// 밤하늘 별 위치/크기(px)/반짝이는 시작 시간(s)
const STARS = [
  { left: 48, top: 96, size: 3, delay: 0 },
  { left: 330, top: 120, size: 4, delay: 0.6 },
  { left: 200, top: 70, size: 2, delay: 0.9 },
  { left: 84, top: 250, size: 3, delay: 1.1 },
  { left: 300, top: 270, size: 3, delay: 0.3 },
  { left: 30, top: 340, size: 2, delay: 0.5 },
  { left: 352, top: 330, size: 2, delay: 1.4 },
]

function CaseReceivedPage() {
  const navigate = useNavigate()

  // 5초 뒤 AI 상황확인으로 이동 (replace: 뒤로가기로 이 화면에 다시 안 오게!)
  useEffect(() => {
    const timer = setTimeout(() => navigate(paths.confirm, { replace: true }), LOADING_MS)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative mx-auto h-dvh w-full max-w-98.25 overflow-hidden bg-bg">
      <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-98.25 -translate-x-1/2">
        {/* 별 */}
        {STARS.map((star) => (
          <span
            key={`${star.left}-${star.top}`}
            className="absolute rounded-full bg-white-100 motion-safe:animate-[twinkle_1.8s_ease-in-out_infinite]"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}

        {/* 의자 + 책상 (제자리에 그대로! 토끼만 움직여용) */}
        <div className="absolute top-50 left-28 h-[192.5px] w-42.5">
          <img src={chair} alt="" className="absolute top-33.25 left-7.25 block max-w-none" />
          <img src={desk} alt="" className="absolute top-42.25 left-0 block max-w-none" />

          {/* 토끼 영역: 아래쪽은 책상 윗선(손 끝)에서 잘라서 책상 뒤에서 올라오는 것처럼 보임 */}
          <div className="absolute -top-10 -left-10 h-52.75 w-62.5 overflow-hidden">
            {/* 토끼만 아래에서 뿅 올라옴 */}
            <div className="absolute top-10 left-10 h-[192.5px] w-42.5 motion-safe:animate-[rabbit-rise_800ms_cubic-bezier(0.34,1.2,0.64,1)_200ms_both]">
              <img src={rabbitBody} alt="" className="absolute top-[138.74px] left-[30.75px] block max-w-none" />
              <img src={rabbitHands} alt="" className="absolute top-[159.51px] left-[63.7px] block max-w-none" />
              {/* 귀는 아래쪽 뿌리를 축으로 흔들림 */}
              <img
                src={rabbitEarRight}
                alt=""
                className="absolute top-[7.37px] left-[75.44px] block max-w-none origin-[20%_95%] motion-safe:animate-[ear-wiggle-right_1.6s_ease-in-out_1.1s_infinite]"
              />
              <img
                src={rabbitEarLeft}
                alt=""
                className="absolute top-0 left-[33.06px] block max-w-none origin-[80%_95%] motion-safe:animate-[ear-wiggle-left_1.6s_ease-in-out_1s_infinite]"
              />
              <img src={rabbitFace} alt="" className="absolute top-[60.66px] left-6.25 block max-w-none" />
              <img src={rabbitNose} alt="" className="absolute top-[109.7px] left-[80.55px] block max-w-none" />
              <img src={rabbitCheeks} alt="" className="absolute top-[112.76px] left-[41.47px] block max-w-none" />
              <img src={rabbitGlasses} alt="" className="absolute top-[93.61px] left-[48.37px] block max-w-none" />
            </div>
          </div>
        </div>

        {/* 달 (의자,책상보다 뒤에 적어서 책상 아랫부분을 덮음) */}
        <div className="absolute top-97 -left-142.75 size-383.75">
          <img src={moon} alt="" className="absolute inset-0 block max-w-none" />
          <img
            src={moonCraters}
            alt=""
            className="absolute inset-0 block max-w-none motion-safe:animate-[moon-spin_120s_linear_infinite]"
          />
        </div>
      </div>

      {/* 사건 접수 완료 문구 */}
      <p
        role="status"
        className="text-h2-semibold absolute inset-x-0 top-107.75 text-center text-black motion-safe:animate-[fade-up_600ms_ease-out_900ms_both]"
      >
        달토끼에게
        <br />
        사건이 접수됐어요.
      </p>
    </div>
  )
}

export default CaseReceivedPage
