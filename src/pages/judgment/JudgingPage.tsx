// AI 재판 - AI 판결 로딩 페이지
// 상황확인 → 이 화면 (문구가 단계별로 바뀜) → 판결 결과

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loadingRabbit from '../../assets/judgment/loading.mp4'
import Header from '../../components/Header'
import Modal from '../../components/Modal'
import { paths } from '../../routes/paths'
import { useCaseStore } from '../../store/useCaseStore'

// 단계별 문구 (순서대로 바뀜)
const STEPS = [
  { title: '달토끼가 판결을 찧고 있어요', description: ['대화 속 말과 맥락을 하나씩 살펴보며', '판결을 만들고 있어요.'] },
  { title: '대화의 재료를 살펴보고 있어요', description: ['누가 어떤 말을 했는지 확인 중...'] },
  { title: '말 사이의 맥락을 찧어보고 있어요', description: ['관계와 대화의 흐름을 파악 중...'] },
  { title: '엇갈린 지점을 골라내고 있어요', description: ['갈등이 시작된 핵심 장면을 분석 중...'] },
  { title: '판결을 마지막으로 빚고 있어요', description: ['과실 비율과 판단 근거를 정리 중...'] },
]

// 문구 하나를 보여주는 시간 (ms)
// TODO: API 연동 시 판결문이 완성되면 결과로 이동 (지금은 문구를 한 바퀴 다 보여주고 이동)
const STEP_MS = 2500

function JudgingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false) // 판결 로딩 나가기 모달
  const clearPendingCase = useCaseStore((state) => state.clearPendingCase)

  // 문구를 차례로 넘기고, 마지막 문구까지 보여준 뒤 이동 (나가기 모달이 떠 있는 동안은 멈춤)
  useEffect(() => {
    if (isLeaveModalOpen) return
    const timer = setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(step + 1)
        return
      }
      // 판결이 끝났으니 '확인 중인 사건'에서 지움
      clearPendingCase()
      // 판결문 도착 화면으로 (뒤로가기로 로딩에 다시 안 오게!)
      navigate(paths.verdict, { replace: true })
    }, STEP_MS)
    return () => clearTimeout(timer)
  }, [step, isLeaveModalOpen, clearPendingCase, navigate])

  const { title, description } = STEPS[step]

  return (
    <div className="mx-auto flex h-dvh w-full max-w-98.25 flex-col bg-bg text-white-100">
      {/* 이미 판결이 진행 중이라 바로 나가지 않고 모달로 한 번 더 확인 */}
      <Header depth={2} title="AI 재판" onBack={() => setIsLeaveModalOpen(true)} />

      <main className="flex flex-1 flex-col items-center justify-center pb-21">
        {/* 망치 찧는 토끼~ */}
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

        {/* 문구가 바뀔 때마다 다시 아래에서 부드럽게 올라옴 (제목 → 설명 순서) */}
        <div role="status" className="mt-4.5 text-center">
          <div key={step}>
            <h1 className="text-h2-semibold motion-safe:animate-[fade-up_500ms_ease-out_both]">{title}</h1>
            {/* 설명이 1줄인 단계에서도 2줄 높이를 확보해서, 문구가 바뀔 때 토끼가 위아래로 안 움직이게 함 */}
            <p className="text-b2-regular mt-2 min-h-11.25 text-gray-30 motion-safe:animate-[fade-up_500ms_ease-out_120ms_both]">
              {description.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </main>

      {/* 계속하기 → 로딩 그대로 / 나가기 → 홈 (사건은 저장돼서 홈에서 이어서 할 수 있음) */}
      <Modal
        open={isLeaveModalOpen}
        title="판결 화면을 나갈까요?"
        description={
          <>
            사건은 저장되어 다음에 이어서 확인할 수 있어요.
            <br />
            사용한 1톨은 반환되지 않아요.
          </>
        }
        cancelText="계속하기"
        confirmText="나가기"
        onCancel={() => setIsLeaveModalOpen(false)}
        onConfirm={() => navigate(paths.home)}
      />
    </div>
  )
}

export default JudgingPage
