// AI 재판 - 판결문 전체 화면
// 판결문 도착('펼쳐보기')에서 탭하면 이 화면

import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import closeIcon from '../../assets/verdict/close-dark.svg'
import copyIcon from '../../assets/verdict/copy.svg'
import titleImage from '../../assets/verdict/title.svg'
import Button from '../../components/Button'
import ShareSheet from '../../components/modal/ShareSheet'
import Toast from '../../components/Toast'
import VerdictBoard from '../../components/VerdictBoard'
import VerdictSummary from '../../components/VerdictSummary'
import { useToast } from '../../hooks/useToast'
import { toVerdictSummary, useCaseIdParam, useVerdict } from '../../hooks/useVerdict'
import { paths } from '../../routes/paths'
import { loadKakao } from '../../utils/kakao'
import { captureImage, shareTo } from '../../utils/share'
import type { ShareTarget } from '../../utils/share'
import { mockVerdict } from './mockVerdict'

// 공유 링크: 받은 사람은 '판결문 공유 유입' 화면으로 들어옴
// TODO: 공유 링크 API 연동 시 사건별 공유 주소로 교체 (이슈 5)
const SHARE_URL = `${window.location.origin}${paths.sharedVerdict(mockVerdict.shareId)}`

function VerdictResultPage() {
  const navigate = useNavigate()
  const caseId = useCaseIdParam() // 주소의 사건 ID
  const { data: verdict, isError } = useVerdict(caseId)
  const { toast, showToast, hideToast } = useToast()
  const [isShareOpen, setIsShareOpen] = useState(false) // 공유하기 모달
  const captureRef = useRef<HTMLDivElement>(null) // 저장할 때 캡처하는 판결문 이미지
  const shareImage = useRef<Promise<File | null> | null>(null) // 캡처 이미지 

  // 잘못된 주소거나 판결을 불러오지 못하면 홈으로
  if (caseId === undefined) return <Navigate to={paths.home} replace />
  if (isError) return <Navigate to={paths.home} replace state={{ toast: '판결문을 불러오지 못했어요.' }} />
  if (!verdict) {
    return (
      <p role="status" className="text-b2-regular mx-auto min-h-dvh w-full max-w-98.25 bg-white-100 pt-20 text-center text-gray-70">
        판결문을 불러오는 중이에요
      </p>
    )
  }

  const summary = toVerdictSummary(verdict) // 판결 요약 · 판결문 이미지에 들어가는 값
  const reply = verdict.recommended_reply // 추천 답장

  // 추천 답장 클립보드 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply)
      showToast('메시지를 복사했습니다.')
    } catch {
      showToast('메시지를 복사하지 못했습니다.')
    }
  }

  // 공유하기 모달을 여는 동안 미리 캡처해 둠
  const openShare = () => {
    void loadKakao() // 카카오톡 버튼을 누르기 전에 SDK를 미리 불러둠
    shareImage.current ??= captureImage(captureRef.current, '달판-판결문.png')
    setIsShareOpen(true)
  }

  // 모달을 먼저 닫고 공유
  const handleShare = async (target: ShareTarget) => {
    setIsShareOpen(false)
    const message = await shareTo(target, {
      url: SHARE_URL,
      text: `달판 AI 판결문 | ${summary.title}`,
      image: shareImage.current,
    })
    if (message) showToast(message)
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
            <VerdictSummary size="full" {...summary} onWhyClick={() => navigate(paths.verdictReason(caseId))} />
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
        </section>

        <div className="mx-6 mt-4.25 flex gap-1.75">
          <Button variant="white" onClick={openShare} className="w-21.75 shrink-0 border border-keycolor-100">
            공유
          </Button>
          <Button variant="primary" onClick={() => navigate(paths.juryRequest)} className="h-10 flex-1">
            배심원에게도 물어보기
          </Button>
        </div>
      </main>

      {/* 공유용 판결문 이미지 */}
      <div aria-hidden="true" inert className="pointer-events-none fixed top-0 left-[-10000px]">
        <VerdictBoard variant="image" ref={captureRef} {...summary} title={summary.title ?? ''} />
      </div>

      <ShareSheet open={isShareOpen} onClose={() => setIsShareOpen(false)} onSelect={handleShare} />
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default VerdictResultPage
