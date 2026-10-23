import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMyJuryActivities } from '../../apis/juryApi'
import { paths } from '../../routes/paths'
import { getApiErrorMessage } from '../../utils/apiError'
import Button from '../../components/Button'
import stamp from '../../assets/my/jury-activity/stamp.png'
import arrow from '../../assets/my/jury-activity/arrow.svg'

const activityDate = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric',
})

function MyJuryActivityPage() {
  const query = useInfiniteQuery({
    queryKey: ['myJuryActivities', 'votes'],
    queryFn: ({ pageParam }) => getMyJuryActivities({ page: pageParam, type: 'votes' }),
    initialPageParam: 1,
    getNextPageParam: (page, _pages, pageParam) => page.next ? pageParam + 1 : undefined,
    staleTime: 0,
    refetchOnMount: 'always',
  })
  const activities = [...new Map((query.data?.pages.flatMap((page) => page.results) ?? [])
    .map((item) => [item.case_id, item])).values()]
  return (
    <section aria-label="배심 활동 내역" className="mx-[24px] flex flex-col gap-[11px] pt-[11px]">
      {query.isPending && <p role="status" className="text-b2-regular py-4">배심 활동을 불러오는 중이에요.</p>}
      {query.isError && !query.data && <div role="alert" className="text-b2-regular py-4">
        <p>{getApiErrorMessage(query.error)}</p>
        <Button onClick={() => void query.refetch()} className="mt-2 underline">다시 시도</Button>
      </div>}
      {query.isSuccess && activities.length === 0 && <p role="status" className="text-b2-regular py-4">아직 판결에 참여한 사건이 없어요.</p>}
      {activities.map((activity) => (
        <article key={activity.case_id} aria-label={activity.title} className="relative h-[210px] overflow-hidden rounded-[20px] bg-white-100">
          <div className="absolute left-[18px] top-[20px] flex w-[204px] max-w-[calc(100%-36px)] flex-col items-start gap-[3px]">
            <span className="text-l1-medium rounded-[50px] bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">{activity.relation}</span>
            <h2 className="text-b1-medium line-clamp-2 break-words text-gray-90">{activity.title}</h2>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute left-[calc(50%+114.39px)] top-[-26px] flex h-[178.473px] w-[129.776px] -translate-x-1/2 items-center justify-center">
            <img src={stamp} alt="" className="h-[160.277px] w-[91.408px] max-w-none rotate-[15deg] object-cover" />
          </div>
          <p className="text-l1-regular absolute left-[18px] top-[109px] text-gray-50">내가 내린 판결</p>
          {activity.my_fault_ratio !== null ? <div aria-label={`작성자 ${activity.my_fault_ratio}%, 상대 ${100 - activity.my_fault_ratio}%`} className="text-b3-regular absolute left-[18px] right-[21px] top-[131px] h-[34px] overflow-hidden rounded-[8px] bg-keycolor-5">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 bg-keycolor-70" style={{ width: `${activity.my_fault_ratio}%` }} />
            <span className={`absolute left-[13px] top-[7px] flex gap-[2px] whitespace-nowrap ${activity.my_fault_ratio >= 30 ? 'text-white-100' : 'text-gray-90'}`}>작성자 <strong className="font-semibold">{activity.my_fault_ratio}%</strong></span>
            <span className={`absolute right-[13px] top-[7px] flex gap-[3px] whitespace-nowrap ${activity.my_fault_ratio > 70 ? 'text-white-100' : 'text-gray-80'}`}>상대 <strong className="font-semibold">{100 - activity.my_fault_ratio}%</strong></span>
          </div> : <p className="text-b3-regular absolute left-[18px] top-[138px] text-gray-50">판결 비율을 확인할 수 없어요.</p>}
          <time dateTime={activity.last_activity_at} aria-label={`최근 활동일 ${activityDate.format(new Date(activity.last_activity_at))}`} className="text-l1-regular absolute left-[21px] top-[175px] text-gray-50">{activityDate.format(new Date(activity.last_activity_at)).replace(/\.$/, '')}</time>
          <Link to={paths.juryDetail(activity.case_id)} className="text-l1-regular absolute right-[14px] top-[175px] flex items-center text-gray-50 focus-visible:outline-2 focus-visible:outline-keycolor-40">
            글 바로가기<img src={arrow} alt="" className="block max-w-none shrink-0" />
          </Link>
        </article>
      ))}
      {query.isFetchNextPageError && <p role="alert" className="text-b3-regular">다음 활동을 불러오지 못했어요.</p>}
      {query.hasNextPage && <Button disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} className="text-b2-regular py-3">
        {query.isFetchingNextPage ? '불러오는 중…' : query.isFetchNextPageError ? '다시 시도' : '더 보기'}
      </Button>}
    </section>
  )
}

export default MyJuryActivityPage
