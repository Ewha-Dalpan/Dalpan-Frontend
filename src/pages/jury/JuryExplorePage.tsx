import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getJuryCases } from '../../apis/juryApi'
import type { JuryRelation } from '../../types/jury'
import { getApiErrorMessage } from '../../utils/apiError'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { paths } from '../../routes/paths'
import participants from '../../assets/jury/participants.svg'
import comment from '../../assets/jury/explore/comment.svg'
import JuryFilterDropdown from './JuryFilterDropdown'

const categories = ['전체', '연애', '친구', '가족', '직장·학교', '기타'] as const
function CaseThumbnail({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false)
  return (
    <div aria-hidden="true" className="size-[105px] shrink-0 overflow-hidden rounded-[8px] bg-gray-5">
      {src && !failed && <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="size-full object-cover object-top" />}
    </div>
  )
}

const sortOptions = ['최신순', '인기순'] as const



function JuryExplorePage() {
  const [category, setCategory] = useState('전체')
  const [sort, setSort] = useState('인기순')
  const [openFilter, setOpenFilter] = useState<'category' | 'sort' | null>(null)
  const relation = category === '전체' ? undefined : category as JuryRelation
  const apiSort = sort === '인기순' ? 'popular' : 'latest'
  const query = useInfiniteQuery({
    queryKey: ['juryCases', { relation, sort: apiSort }],
    queryFn: ({ pageParam }) => getJuryCases({ page: pageParam, relation, sort: apiSort }),
    initialPageParam: 1,
    getNextPageParam: (page, _pages, pageParam) => page.next ? pageParam + 1 : undefined,
  })
  const cases = [...new Map((query.data?.pages.flatMap((page) => page.results) ?? []).map((item) => [item.case_id, item])).values()]

  return (
    <section aria-label="사건 탐색" className="pt-[12px]">
      <div className="mx-[24px] flex items-start gap-[8px]">
        <JuryFilterDropdown label="카테고리" value={category} options={categories}
          open={openFilter === 'category'} onOpenChange={(open) => setOpenFilter(open ? 'category' : null)} onChange={setCategory} />
        <JuryFilterDropdown label="정렬" value={sort} options={sortOptions}
          open={openFilter === 'sort'} onOpenChange={(open) => setOpenFilter(open ? 'sort' : null)} onChange={setSort} />
      </div>
      {query.isPending && <p role="status" className="px-6 py-4">사건 목록을 불러오는 중이에요.</p>}
      {query.isError && !query.data && <div role="alert" className="px-6 py-4"><p>{getApiErrorMessage(query.error)}</p><Button onClick={() => void query.refetch()} className="mt-2">다시 시도</Button></div>}
      <ul aria-label="사건 목록" className="mt-[12px]">
        {cases.map((item) => (
          <li key={item.case_id} className="not-first:pt-[3px]">
            <Link to={paths.juryParticipate(item.case_id)} className="flex w-full text-left items-center gap-[5px] px-[24px] py-[16px] focus-visible:outline-2 focus-visible:outline-keycolor-40">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
                <span className="text-l1-medium rounded-[50px] bg-sub px-[8px] py-[4px]">{item.relation}</span>
                <div className="flex w-full flex-col gap-[7px] px-[2px]">
                  <h2 className="text-b2-medium break-keep [overflow-wrap:anywhere]">{item.title}</h2>
                  <div className="text-l1-medium flex flex-wrap items-start gap-[7px] text-gray-50">
                    <span className="flex items-center gap-[2px] whitespace-nowrap">
                      <span className="relative size-[16px] shrink-0">
                        <img src={participants} alt="" className="absolute left-[8.17%] top-[8.33%] block max-w-none" />
                      </span>
                      {item.jury_count}명 참여
                    </span>
                    <span className="flex items-center gap-[2px] whitespace-nowrap">
                      <img src={comment} alt="" className="block shrink-0 max-w-none" />
                      댓글 수 {item.comment_count}
                    </span>
                  </div>
                </div>
              </div>
              <CaseThumbnail key={item.thumbnail} src={item.thumbnail} />
            </Link>
            <div className="mx-[10px] mt-[3px] h-px bg-sub" />
          </li>
        ))}
      </ul>
      {query.isSuccess && cases.length === 0 && <p role="status" className="text-b2-regular px-[24px] py-[16px] text-gray-50">해당 카테고리의 사건이 없습니다.</p>}
      {query.isFetchNextPageError && <p role="alert" className="px-6 py-4">다음 사건을 불러오지 못했어요. 다시 시도해 주세요.</p>}
      {query.hasNextPage && <Button disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} className="my-4 w-full">{query.isFetchingNextPage ? '불러오는 중…' : query.isFetchNextPageError ? '다시 시도' : '더 보기'}</Button>}
    </section>
  )
}

export default JuryExplorePage
