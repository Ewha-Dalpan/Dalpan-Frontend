// AI 재판 - 판결문 도착 페이지
// AI 판결 로딩 → 이 화면: 봉투가 올라오고 '재판완료' 도장 쾅 → 판결문이 반쯤 나온 '판결문 펼쳐보기'
// 연출이 끝난 뒤 화면 아무 데나 누르면 판결문 전체 화면으로

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import stamp from '../../assets/verdict/stamp.png'
import Button from '../../components/Button'
import { EnvelopeBack, EnvelopeFront } from '../../components/Envelope'
import Header from '../../components/Header'
import VerdictSummary from '../../components/VerdictSummary'
import { paths } from '../../routes/paths'

// TODO: API 연동 시 방금 판결된 사건으로 교체
const mockVerdict = { caseNumber: '月 제0241호', relation: '연인', title: '약속 직전 연락 공백 사건' }

// 도장 연출(3초) 중 화면 가운데에 머무를 때, 제자리('펼쳐보기' 위치)에서 떨어진 거리
const PAPER_INTRO = { '--intro-y': '25px' } as CSSProperties
const ENVELOPE_INTRO = { '--intro-y': '-188px' } as CSSProperties

// 도장이 찍힐 때 봉투가 눌리는 중심점!
const BACK_PRESS = { ...ENVELOPE_INTRO, transformOrigin: '172px 263px' }
const FRONT_PRESS = { ...ENVELOPE_INTRO, transformOrigin: '172px 220px' }
const PAPER_PRESS = { ...PAPER_INTRO, transformOrigin: '148px 241px' }

// 연출 시간 (이 시간이 지나야 탭으로 펼쳐볼 수 있음!! 그 전까지 탭 비활성화~)
const INTRO_MS = 3000

// '동작 줄이기' 설정이면 연출이 없으니 처음부터 탭 가능
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function VerdictPage() {
  const navigate = useNavigate()
  const [canOpen, setCanOpen] = useState(prefersReducedMotion) // 펼쳐보기 탭 가능 여부

  // 연출이 끝나면 탭 가능
  useEffect(() => {
    if (canOpen) return
    const timer = setTimeout(() => setCanOpen(true), INTRO_MS)
    return () => clearTimeout(timer)
  }, [canOpen])

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-bg text-white-100">
      {/* X: 홈으로 */}
      <Header depth={2} title="AI 판결문" onClose={() => navigate(paths.home)} />

      <main className="relative h-[calc(100dvh-51px)] overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 w-98.25 -translate-x-1/2">
          <p role="status" className="text-h3-semibold absolute inset-x-0 top-7 text-center opacity-0 motion-safe:animate-[arrival-text_3s_both]">
            판결문이 도착했습니다.
          </p>
          {/* 연출이 끝나면 나타남 */}
          <p className="text-b3-regular absolute inset-x-0 top-17.5 text-center motion-safe:animate-[fade-up_500ms_ease-out_2.9s_both]">
            판결문 펼쳐보기
          </p>

          {/* 봉투 뒷면 → 판결문 → 봉투 앞면 순서로 쌓아서, 판결문이 봉투에 꽂힌 것처럼 보임 */}
          <EnvelopeBack
            className="absolute top-72.75 left-6.25 z-0 h-10.75 w-86 motion-safe:animate-[verdict-intro_3s_both,stamp-thud_300ms_ease-out_1.3s]"
            style={BACK_PRESS}
          />

          {/* 판결문 미리보기 (내용은 흐리게 가려서 펼쳐보고 싶게) */}
          <div
            className="absolute top-25 left-12.25 z-10 h-98.25 w-71.5 overflow-hidden rounded-lg bg-white-100 shadow-[0_0_13.8px_rgba(0,0,0,0.1)] motion-safe:animate-[verdict-intro_3s_both,stamp-thud_300ms_ease-out_1.3s]"
            style={PAPER_PRESS}
          >
            <div className="absolute top-6.5 left-1/2 -translate-x-1/2">
              <VerdictSummary size="preview" {...mockVerdict} />
            </div>
            <div className="absolute top-3.75 left-4 h-75 w-62.5 bg-white-100/50 backdrop-blur-[9px]" />
          </div>

          {/* 봉투 앞면 + '재판완료' 도장 (1초 뒤 크게 떠 있다가 쾅, 그때 봉투가 살짝 눌림) */}
          <EnvelopeFront
            className="absolute top-83.5 left-6.25 z-20 h-117 w-86 motion-safe:animate-[verdict-intro_3s_both,stamp-thud_300ms_ease-out_1.3s]"
            style={FRONT_PRESS}
          >
            <img
              src={stamp}
              alt=""
              className="absolute top-55 left-1/2 h-76.75 w-43.75 max-w-none -translate-x-1/2 -translate-y-1/2 rotate-30 object-cover motion-safe:animate-[stamp-press_300ms_cubic-bezier(0.55,0,1,0.45)_1s_both]"
            />
          </EnvelopeFront>

          {/* 연출이 끝나면 화면 아무 데나 눌러 판결문 전체 화면으로 */}
          <Button
            aria-label="판결문 펼쳐보기"
            disabled={!canOpen}
            onClick={() => navigate(paths.verdictResult, { replace: true })}
            className="absolute inset-0 z-30 enabled:cursor-pointer"
          />
        </div>
      </main>
    </div>
  )
}

export default VerdictPage
