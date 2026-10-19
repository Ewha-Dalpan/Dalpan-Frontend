// AI 재판 - 공유 받은 판결문
// 다른 사람이 공유한 링크로 들어온 사람이 보는 화면!! (로그인 없이 볼 수 있음)

import arrow from '../../assets/verdict/arrow-full.svg'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import VerdictBoard from '../../components/VerdictBoard'
import { toVerdictSummary, useSharedVerdict } from '../../hooks/useVerdict'
import { paths } from '../../routes/paths'

function SharedVerdictPage() {
  const navigate = useNavigate()
  const { shareId } = useParams() // 주소의 /shared/:shareId (공유 토큰)
  const { data: verdict, isError } = useSharedVerdict(shareId)

  // 나도 판결받기 → AI 재판 시작 (로그인 안 했으면 로그인부터)
  const startJudgment = () => navigate(paths.upload)

  // 링크가 잘못됐거나 공유가 취소된 경우
  if (isError || !shareId) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col items-center justify-center bg-white-100 px-6 text-center">
        <h1 className="text-h3-semibold text-gray-90">판결문을 찾을 수 없어요</h1>
        <p className="text-b2-regular mt-2 text-gray-70">
          공유가 취소됐거나 잘못된 링크예요.
          <br />
          대신 내 고민을 판결받아 보는 건 어때요?
        </p>
        <Button variant="primary" onClick={startJudgment} className="mt-6 h-10 w-full">
          나도 판결받기
        </Button>
      </main>
    )
  }

  if (!verdict) {
    return (
      <p role="status" className="text-b2-regular mx-auto min-h-dvh w-full max-w-98.25 bg-white-100 pt-20 text-center text-gray-70">
        판결문을 불러오는 중이에요
      </p>
    )
  }

  const summary = toVerdictSummary(verdict)

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-white-100 @container">
      <main className="h-[min(798px,203.0534cqw)] motion-safe:animate-[fade-up_500ms_ease-out_both]">
        <div className="origin-top-left scale-[min(1,calc(100cqw/393px))]">
          <VerdictBoard variant="page" {...summary}>
            {/* 한 줄 결과 + '왜 이렇게 판단했을까?'*/}
            <div className="absolute top-132 left-1/2 flex w-71 -translate-x-1/2 flex-col items-center">
              <p className="text-b2-medium line-clamp-3 text-center break-keep text-gray-70">{verdict.one_line}</p>
              {/* 공유 받은 사람도 판단 근거를 볼 수 있음 → 뒤로가기 하면 이 화면으로 */}
              <Button
                onClick={() => navigate(paths.sharedVerdictReason(shareId))}
                className="text-l1-medium mt-1.5 flex cursor-pointer items-center text-gray-50"
              >
                <span className="-mr-0.5">왜 이렇게 판단했을까?</span>
                <img src={arrow} alt="" className="block max-w-none" />
              </Button>
            </div>

            <Button variant="primary" onClick={startJudgment} className="absolute top-178.75 left-6 h-10 w-86.25">
              나도 판결받기
            </Button>
          </VerdictBoard>
        </div>
      </main>
    </div>
  )
}

export default SharedVerdictPage
