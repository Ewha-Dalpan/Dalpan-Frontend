// AI 재판 - 공유 받은 판결문
// 다른 사람이 공유한 링크로 들어온 사람이 보는 화면!

import arrow from '../../assets/verdict/arrow-full.svg'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import VerdictBoard from '../../components/VerdictBoard'
import { paths } from '../../routes/paths'
import { mockVerdict } from './mockVerdict'

function SharedVerdictPage() {
  const navigate = useNavigate()
  const { shareId = mockVerdict.shareId } = useParams() // 주소의 /shared/:shareId
  // TODO: API 연동 시 주소의 shareId(useParams)로 공유된 판결문 불러오기
  const { caseNumber, relation, title, myReasons, otherReasons, myRatio, otherRatio } = mockVerdict

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-white-100 @container">
      <main className="h-[min(798px,203.0534cqw)] motion-safe:animate-[fade-up_500ms_ease-out_both]">
        <div className="origin-top-left scale-[min(1,calc(100cqw/393px))]">
          <VerdictBoard variant="page" {...{ caseNumber, relation, title, myReasons, otherReasons, myRatio, otherRatio }}>
            <p className="text-b2-medium absolute top-138 left-1/2 w-71 -translate-x-1/2 text-center text-gray-70">상대 쪽으로 저울이 기울었어요.</p>
            {/* 공유 받은 사람도 판단 근거를 볼 수 있음 → 뒤로가기 하면 이 화면으로 */}
            <Button
              onClick={() => navigate(paths.sharedVerdictReason(shareId))}
              className="text-l1-medium absolute top-144.5 left-1/2 flex -translate-x-1/2 cursor-pointer items-center text-gray-50"
            >
              <span className="-mr-0.5">왜 이렇게 판단했을까?</span>
              <img src={arrow} alt="" className="block max-w-none" />
            </Button>

            {/* 나도 판결받기 → AI 재판 시작 (TODO: 로그인이 생기면 로그인 안 한 사람은 로그인부터) */}
            <Button variant="primary" onClick={() => navigate(paths.upload)} className="absolute top-178.75 left-6 h-10 w-86.25">
              나도 판결받기
            </Button>
          </VerdictBoard>
        </div>
      </main>
    </div>
  )
}

export default SharedVerdictPage
