import ImageViewer from '../../components/ImageViewer'
import Button from '../../components/Button'
import { useState } from 'react'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import type { JuryCaseDetail } from '../../types/jury'

function CaseImage({ src, index, onOpen }: { src: string; index: number; onOpen: () => void }) {
  const [failed, setFailed] = useState(false)
  return <li className="relative size-[201px] shrink-0 overflow-hidden rounded-[14.306px] bg-gray-10">
    {failed ? <p className="p-4 text-l1-regular text-gray-50">이미지를 불러오지 못했어요.</p> :
      <Button aria-label={`대화 캡처 ${index + 1} 전체 보기`} onClick={onOpen} className="block size-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-keycolor-100"><img src={src} alt={`대화 캡처 ${index + 1}`} onError={() => setFailed(true)} draggable={false} className="pointer-events-none size-full object-cover object-top" /></Button>}
  </li>
}

export default function JuryCaseContent({ item }: { item: JuryCaseDetail }) {
  const [selected, setSelected] = useState<number | null>(null)
  const scrollHandlers = useHorizontalScroll(204.515)
  const date = new Date(item.public_at)
  return <div className="flex-none flex flex-col gap-[23px]">
    <div className="mx-[24px] flex flex-col items-center gap-[4px]">
      <p className="text-l2-regular text-gray-30">{Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
      <div className="flex w-full items-center justify-center gap-[2px]">
        <span className="text-l1-medium shrink-0 rounded-full bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">{item.relation}</span>
        <h2 className="text-h3-semibold min-w-0 break-keep [overflow-wrap:anywhere]">{item.title}</h2>
      </div>
    </div>
    <ul tabIndex={0} aria-label="대화 캡처 (좌우로 넘겨보기)" {...scrollHandlers}
      className="scrollbar-none flex min-h-[201px] gap-[3.515px] overflow-x-auto overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing px-[24px] select-none focus-visible:outline-2 focus-visible:outline-keycolor-40">
      {item.images.map((src, index) => <CaseImage key={`${src}-${index}`} src={src} index={index} onOpen={() => setSelected(index)} />)}
      {!item.images.length && <li className="text-b2-regular text-gray-50">공개된 대화 이미지가 없습니다.</li>}
    </ul>
    {selected !== null && item.images[selected] && <ImageViewer key={item.images[selected]} src={item.images[selected]} alt={`대화 캡처 ${selected + 1} 전체 이미지`} onClose={() => setSelected(null)} />}
  </div>
}
