import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/paths'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getCases } from '../../apis/caseApi'
import { getApiErrorMessage } from '../../utils/apiError'
import ResumeCaseModal from '../../components/modal/ResumeCaseModal'
import type { CaseStatus } from '../../types/case'
import Button from '../../components/Button'
import folderTexture from '../../assets/my/cases/folder-texture.png'
import separator from '../../assets/my/cases/separator.svg'

const statusLabels: Record<CaseStatus, string> = { WRITING: '작성 중', CONFIRMING: '상황 확인 중', READY: '판결 대기', JUDGING: '판결 중', JUDGED: '판결 완료' }

function MyCasesPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const [resumeId, setResumeId] = useState<number | null>(null)
  const { data, isPending, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = useInfiniteQuery({
    queryKey: ['myCases'],
    queryFn: ({ pageParam }) => getCases({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => lastPage.next ? lastPageParam + 1 : undefined,
  })
  const cases = data?.pages.flatMap((page) => page.results) ?? []
  if (isPending) return <p role="status" className="p-6 text-center text-white-100">사건 목록을 불러오는 중이에요.</p>
  if (isError && !data) return <div role="alert" className="p-6 text-center text-white-100"><p>{getApiErrorMessage(error)}</p><Button onClick={() => void refetch()} className="mt-4">다시 시도</Button></div>

  return (
    <section aria-label="내 사건 목록" className="mx-[24px] grid grid-cols-2 items-start gap-[9px] pt-[17px]">
      {cases.length === 0 && <p className="col-span-2 py-6 text-center text-white-100">아직 접수한 사건이 없어요.</p>}
      {cases.map((entry) => {
        const item = { ...entry, category: entry.situation?.relation ?? '관계 미정', status: statusLabels[entry.status] ?? '상태 확인 중', date: new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(entry.created_at)) }

        const selected = selectedId === item.id
        return (
          <Button key={item.id} aria-expanded={selected} aria-controls={`case-preview-${item.id}`}
            aria-label={`${item.category} ${item.date} 접수, ${item.status}, ${selected ? '판결문 보기' : '제목 미리보기'}`}
            onClick={() => { if (!selected) setSelectedId(item.id); else if (entry.status === 'JUDGED') navigate(paths.myCaseDetail(item.id)); else setResumeId(item.id) }}
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
      {isFetchNextPageError && <p role="alert" className="col-span-2 text-white-100">추가 사건을 불러오지 못했어요. 다시 시도해 주세요.</p>}
      {hasNextPage && <Button disabled={isFetchingNextPage} onClick={() => void fetchNextPage()} className="col-span-2 my-4 text-white-100">{isFetchingNextPage ? '불러오는 중…' : isFetchNextPageError ? '다시 시도' : '더 보기'}</Button>}
      {resumeId !== null && <ResumeCaseModal caseId={resumeId} onClose={() => setResumeId(null)} />}
    </section>
  )
}

export default MyCasesPage
