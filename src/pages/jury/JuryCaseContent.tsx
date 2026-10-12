import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import chat from '../../assets/jury/participation/chat.png'
import { exampleJuryCases } from './exampleJuryCases'

export default function JuryCaseContent({ item }: { item: (typeof exampleJuryCases)[number] }) {
  const scrollHandlers = useHorizontalScroll(204.515)
  const title = item.id === 1 ? '약속 직전 연락 공백 사건' : item.title.join(' ')
  return (
          <div className="flex-none flex flex-col gap-[23px]">
          <div className="mx-[24px] flex flex-col items-center gap-[4px]">
            <p className="text-l2-regular text-gray-30">2026. 9. 17</p>
            <div className="flex items-center justify-center gap-[2px]">
              <span className="text-l1-medium shrink-0 rounded-full bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">{item.category}</span>
              <h2 className="text-h3-semibold line-clamp-2">{title}</h2>
            </div>
          </div>
          <ul tabIndex={0} aria-label="대화 캡처 (좌우로 넘겨보기)" {...scrollHandlers}
            className="scrollbar-none flex gap-[3.515px] overflow-x-auto overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing px-[24px] select-none focus-visible:outline-2 focus-visible:outline-keycolor-40"
>
            {[0, 1, 2].map((index) => (
              <li key={index} className="relative size-[201px] shrink-0 overflow-hidden rounded-[14.306px] bg-gray-10">
                <div className="absolute left-[-9.3495px] top-[0.003px] h-[200.634px] w-[218.539px] overflow-hidden rounded-[31.163px]">
                  <img src={chat} alt={`예시 대화 캡처 ${index + 1}`} draggable={false} className="pointer-events-none absolute left-0 top-[-93.26%] h-[288.71%] w-full max-w-none" />
                </div>
              </li>
            ))}
          </ul>
          </div>
  )
}
