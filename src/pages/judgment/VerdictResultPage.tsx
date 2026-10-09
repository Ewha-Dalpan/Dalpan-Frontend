// AI 재판 - 판결문 전체 화면
// 판결문 도착('펼쳐보기')에서 탭하면 이 화면

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import closeIcon from '../../assets/verdict/close-dark.svg'
import copyIcon from '../../assets/verdict/copy.svg'
import titleImage from '../../assets/verdict/title.svg'
import Button from '../../components/Button'
import VerdictSummary from '../../components/VerdictSummary'
import { paths } from '../../routes/paths'

// TODO: API 연동 시 방금 판결된 사건으로 교체
const mockVerdict = {
  caseNumber: '月 제0241호',
  relation: '연인',
  title: '약속 직전 연락 공백 사건',
  reply: '다음부터 늦어질 것 같으면 미리 한마디만 해줬으면 좋겠어. 약속이 어떻게 되는지 몰라서 좀 서운했어.',
}

function VerdictResultPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false) // 답장 복사 여부 
  const { reply, ...summary } = mockVerdict

  // 추천 답장 클립보드 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-white-100 pb-8 @container">
      <header className="relative h-12.75">
        <h1 className="absolute top-5.5 left-1/2 -translate-x-1/2">
          <img src={titleImage} alt="판결문" className="block max-w-none" />
        </h1>
        {/* X: 홈으로 */}
        <Button aria-label="닫기" onClick={() => navigate(paths.home)} className="absolute top-4 right-5.75 size-6 cursor-pointer">
          <img src={closeIcon} alt="" className="block max-w-none" />
        </Button>
      </header>

      <main className="motion-safe:animate-[fade-up_500ms_ease-out_both]">
        <div className="mt-8.25 h-[min(473px,120.356cqw)]">
          <div className="origin-top-left scale-[min(1,calc(100cqw/393px))]">
            {/* TODO: '왜 이렇게 판단했을까?' 화면이 생기면 onWhyClick 연결 */}
            <VerdictSummary size="full" {...summary} />
          </div>
        </div>

        {/* 추천 답장 + 복사 */}
        <section aria-label="추천 답장" className="mx-6 mt-11.25 flex items-start rounded-lg bg-gray-5 px-4 py-3">
          <div className="flex-1">
            <p className="text-b3-medium text-gray-50">이렇게 보내보는 건 어때요?</p>
            <p className="text-b2-medium mt-0.5 text-gray-80">{reply}</p>
          </div>
          <Button aria-label="추천 답장 복사" onClick={handleCopy} className="shrink-0 cursor-pointer">
            <img src={copyIcon} alt="" className="block max-w-none" />
          </Button>
          <span role="status" className="sr-only">
            {copied ? '추천 답장을 복사했어요.' : ''}
          </span>
        </section>

        {/* TODO: 공유하기 모달, 배심원에게도 물어보기 화면이 생기면 연결 */}
        <div className="mx-6 mt-4.25 flex gap-1.75">
          <Button variant="white" className="w-21.75 shrink-0 border border-keycolor-100">
            공유
          </Button>
          <Button variant="primary" className="h-10 flex-1">
            배심원에게도 물어보기
          </Button>
        </div>
      </main>
    </div>
  )
}

export default VerdictResultPage
