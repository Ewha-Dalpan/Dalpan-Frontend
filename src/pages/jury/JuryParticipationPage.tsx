import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Toast from '../../components/Toast'
import { useGoBack } from '../../hooks/useGoBack'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import chat from '../../assets/jury/participation/chat.png'
import { exampleJuryCases } from './exampleJuryCases'
import JuryBalance from './JuryBalance'

function Participation({ item }: { item: (typeof exampleJuryCases)[number] }) {
  const goBack = useGoBack(paths.juryExplore)
  const scrollHandlers = useHorizontalScroll(204.515)
  const { toast, showToast, hideToast } = useToast()
  const [ratio, setRatio] = useState(50)
  const [touched, setTouched] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const title = item.id === 1 ? '약속 직전 연락 공백 사건' : item.title.join(' ')

  useEffect(() => {
    if (!touched) hintTimer.current = setTimeout(() => setShowHint(true), 2000)
    return () => { if (hintTimer.current) clearTimeout(hintTimer.current) }
  }, [touched])

  const resetHint = () => {
    if (hintTimer.current) clearTimeout(hintTimer.current)
    setShowHint(false)
    if (!touched) hintTimer.current = setTimeout(() => setShowHint(true), 2000)
  }

  return (
    <div className="relative mx-auto h-[max(770px,100dvh)] w-full max-w-[393px] overflow-clip bg-white-100 text-gray-90 @container"
      onPointerDown={resetHint} onKeyDown={resetHint}>
      <div className="absolute left-0 top-0 h-[804px] w-[393px] origin-top-left scale-[min(1,calc(100cqw/393px))]">
        <Header depth={2} title="배심원석" theme="white" onBack={goBack} />
        <main>
          <div className="absolute inset-x-0 top-[56px] flex flex-col gap-[23px]">
          <div className="mx-[24px] flex flex-col items-center gap-[4px]">
            <p className="text-l2-regular text-gray-30">2026. 9. 17</p>
            <div className="flex items-center justify-center gap-[2px]">
              <span className="text-l1-medium shrink-0 rounded-full bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">{item.category}</span>
              <h2 className="text-h3-semibold line-clamp-2">{title}</h2>
            </div>
          </div>
          <ul tabIndex={0} aria-label="대화 캡처 (좌우로 넘겨보기)" {...scrollHandlers}
            className="scrollbar-none flex gap-[3.515px] overflow-x-auto overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing px-[24px] select-none focus-visible:outline-2 focus-visible:outline-keycolor-40"
            onScroll={resetHint}>
            {[0, 1, 2].map((index) => (
              <li key={index} className="relative size-[201px] shrink-0 overflow-hidden rounded-[14.306px] bg-gray-10">
                <div className="absolute left-[-9.3495px] top-[0.003px] h-[200.634px] w-[218.539px] overflow-hidden rounded-[31.163px]">
                  <img src={chat} alt={`예시 대화 캡처 ${index + 1}`} draggable={false} className="pointer-events-none absolute left-0 top-[-93.26%] h-[288.71%] w-full max-w-none" />
                </div>
              </li>
            ))}
          </ul>
          </div>
          <JuryBalance value={ratio} touched={touched} showHint={showHint} onChange={setRatio} onTouch={() => { setTouched(true); setShowHint(false) }} />
          <Button disabled={!touched} onClick={() => showToast('판결 제출 기능은 준비 중이에요.')}
            className="text-b2-semibold absolute left-[24px] top-[721px] z-30 flex h-[40px] w-[345px] items-center justify-center rounded-[8px] bg-keycolor-100 text-white-100 enabled:cursor-pointer disabled:bg-gray-10 disabled:text-gray-60">
            판결 제출하기
          </Button>
        </main>
      </div>
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

function JuryParticipationPage() {
  const { caseId } = useParams()
  const item = exampleJuryCases.find((entry) => String(entry.id) === caseId)
  if (!item) return <Navigate to={paths.juryExplore} replace />
  return <Participation key={item.id} item={item} />
}

export default JuryParticipationPage
