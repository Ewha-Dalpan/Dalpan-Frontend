// AI 재판 - AI 상황확인 페이지 (2.1.2)
// 헤더는 JudgmentLayout에서!

import { useState } from 'react'
import swapIcon from '../../assets/judgment/swap.svg'
import Button from '../../components/Button'
import InlineEditField from '../../components/InlineEditField'

// TODO: API 연동 전 가짜 데이터
const mockAnalysis = {
  situation: '약속 당일 상대가 약 4시간 동안 연락하지 않았고, 내가 서운함을 표현하는 과정에서 갈등이 생겼어요.',
  coreIssue: '연락이 늦어진 행동과 그에 대한 감정 표현 중 어느 쪽의 책임이 더 큰지예요.',
}

function ConfirmPage() {
  const [isSwapped, setIsSwapped] = useState(false) // 화자 좌우 반전 여부
  const [situation, setSituation] = useState(mockAnalysis.situation) // 상황 (수정 가능!!)

  // 기본은 왼쪽=상대, 오른쪽=나 / ⇄ 누르면 반대로
  const leftSpeaker = isSwapped ? '나' : '상대'
  const rightSpeaker = isSwapped ? '상대' : '나'

  // 상황을 전부 지우면 버튼 비활성화!! 
  const canSubmit = situation.trim().length > 0

  return (
    // 헤더를 뺀 화면 높이를 채워서 CTA가 항상 맨 아래에 붙게 함
    <div className="flex min-h-[calc(100dvh-51px)] flex-col px-6 pt-3.5 pb-8.5">
      <h2 className="text-h2-semibold text-gray-90">제가 이해한 상황이 맞나요?</h2>
      <p className="text-b2-regular mt-2 text-gray-90">
        대화를 바탕으로 상황을 이렇게 정리했어요.
        <br />
        다른 부분만 가볍게 수정해주세요.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        {/* 화자 구분 */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-b2-regular text-gray-100">화자 구분</h3>
            <Button
              aria-label="말풍선 좌우 바꾸기"
              aria-pressed={isSwapped}
              onClick={() => setIsSwapped((prev) => !prev)}
              className="cursor-pointer"
            >
              <img src={swapIcon} alt="" className="block max-w-none" />
            </Button>
          </div>
          <ul className="text-b2-regular mt-2.25 flex gap-3 text-gray-100">
            <li className="flex items-center gap-2.25">
              <span className="size-5 rounded-[4.2px] bg-[#50ff9c]" />
              왼쪽 말풍선 = {leftSpeaker}
            </li>
            <li className="flex items-center gap-2.25">
              <span className="size-5 rounded-[4.2px] bg-[#53bdff]" />
              오른쪽 말풍선 = {rightSpeaker}
            </li>
          </ul>
        </section>

        <InlineEditField label="상황" value={situation} onChange={setSituation} />
        <InlineEditField label="이번 갈등 핵심은" value={mockAnalysis.coreIssue} editable={false} />
      </div>

      {/* TODO: AI 재판 로딩 화면이 생기면 이동 연결!! 수정한 내용 API로 보내기 */}
      <div className="mt-auto pt-6">
        <Button variant="primary" fullWidth disabled={!canSubmit} className="h-10">
          이대로 판결받기
        </Button>
      </div>
    </div>
  )
}

export default ConfirmPage
