import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/paths'
import { exampleMyCases } from './exampleMyCases'
import Button from '../../components/Button'
import folderTexture from '../../assets/my/cases/folder-texture.png'
import separator from '../../assets/my/cases/separator.svg'

function MyCasesPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <section aria-label="내 사건 목록" className="mx-[24px] grid grid-cols-2 items-start gap-[9px] pt-[17px]">
      {exampleMyCases.map((item) => {
        const selected = selectedId === item.id
        return (
          <Button key={item.id} aria-expanded={selected} aria-controls={`case-preview-${item.id}`}
            aria-label={`${item.category} ${item.date} 접수, ${item.status}, ${selected ? '판결문 보기' : '제목 미리보기'}`}
            onClick={() => selected ? navigate(paths.myCaseDetail(item.id)) : setSelectedId(item.id)}
            onKeyDown={(event) => { if (event.key === 'Escape') setSelectedId(null) }}
            className={`relative min-w-0 cursor-pointer rounded-[8px] text-left motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${selected ? 'h-[159px]' : 'h-[125px]'}`}
          >
            <span aria-hidden="true" className={`absolute left-0 h-[20px] w-full overflow-hidden rounded-t-[8px] motion-safe:transition-[top] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${selected ? 'top-[34px]' : 'top-0'}`}>
              <img src={folderTexture} alt="" className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(143,143,143,0.12) 100%), linear-gradient(181.77920031338078deg, rgba(201,160,128,0.4) 3.4489%, rgba(180,140,106,0.4) 93.836%)' }} />
            </span>
            <span id={`case-preview-${item.id}`} hidden={!selected} className="text-l2-medium absolute left-[14px] right-[15px] top-px rounded-[8px] bg-white-100 px-[14px] pb-[32px] pt-[14px] text-gray-60 drop-shadow-[0_0_6.9px_rgba(0,0,0,0.1)] motion-safe:animate-[case-preview-reveal_500ms_cubic-bezier(0.22,1,0.36,1)_both]">
              {item.title ?? '사건 요약 준비 중'}
            </span>
            <span className={`absolute left-0 flex h-[105px] w-full flex-col items-center justify-center overflow-hidden rounded-b-[8px] pb-[23px] pt-[16px] motion-safe:transition-[top] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${selected ? 'top-[54px]' : 'top-[20px]'}`}>
              <span aria-hidden="true" className="absolute inset-0 bg-white-100">
                <img src={folderTexture} alt="" className="absolute inset-0 size-full object-cover opacity-90" />
                <span className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(189.26226910178383deg, rgba(201,160,128,0.4) 3.4489%, rgba(216,179,148,0.4) 93.836%)' }} />
              </span>
              <span className="text-l2-medium relative flex flex-col items-center gap-[6px] whitespace-nowrap">
                <span className="rounded-[8px] bg-keycolor-100 px-[10px] py-[6px] text-white-100">{item.status}</span>
                <span className="flex items-center gap-[4px] rounded-[8px] bg-white-100 px-[10px] py-[6px] text-gray-60">
                  <span>{item.category}</span>
                  <img src={separator} alt="" className="block max-w-none shrink-0" />
                  <span>{item.date} 접수</span>
                </span>
              </span>
            </span>
          </Button>
        )
      })}
    </section>
  )
}

export default MyCasesPage
