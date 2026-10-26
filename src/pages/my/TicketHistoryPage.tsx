import { useInfiniteQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCoinLedger } from '../../apis/coinApi'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { paths } from '../../routes/paths'
import { getApiErrorMessage } from '../../utils/apiError'
import { getCoinLedgerLabel, groupCoinLedger } from '../../utils/coinLedger'
import minus from '../../assets/my/history/minus.svg'
import plus from '../../assets/my/history/plus.svg'
import tol from '../../assets/my/history/tol.svg'

export default function TicketHistoryPage() {
  const navigate = useNavigate()
  const query = useInfiniteQuery({
    queryKey: ['coinLedger'],
    queryFn: ({ pageParam }) => getCoinLedger({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (page, _pages, pageParam) => page.next ? pageParam + 1 : undefined,
    staleTime: 0,
    refetchOnMount: 'always',
  })
  const groups = groupCoinLedger(query.data?.pages.flatMap((page) => page.results) ?? [])

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[393px] bg-bg text-white-100">
      <Header depth={2} title="이용권 사용 내역" onBack={() => navigate(paths.my)} />
      <main className="mx-[17px] pt-[9px] pb-[34px]">
        {query.isPending && <p role="status" className="text-b2-regular px-2 py-[10px] text-gray-30">이용 내역을 불러오는 중이에요.</p>}
        {query.isError && !query.data && <div role="alert" className="text-b2-regular px-2 py-[10px]">
          <p>{getApiErrorMessage(query.error)}</p>
          <Button onClick={() => void query.refetch()} className="mt-2 underline">다시 시도</Button>
        </div>}
        {query.isSuccess && groups.length === 0 && <p role="status" className="text-b2-regular px-2 py-[10px] text-gray-30">이용권 사용 내역이 없어요.</p>}
        <div className="flex flex-col gap-[24px]">
          {groups.map(({ date, entries }) => (
            <section key={date} aria-label={date}>
              <h2 className="text-l1-medium flex h-[24px] items-center px-[8px] text-gray-10">{date}</h2>
              <div className="mt-px h-px bg-gray-60" />
              <ul>
                {entries.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-2 px-[8px] py-[10px]">
                    <p className="text-b2-medium">{getCoinLedgerLabel(item)}</p>
                    <div className="flex shrink-0 flex-col items-end gap-[5px]">
                      <div aria-label={`${item.amount > 0 ? '적립' : '사용'} ${Math.abs(item.amount)}톨`} className={`text-b2-semibold flex items-center ${item.amount > 0 ? 'text-[#d3ff82]' : 'text-white-100'}`}>
                        <img src={item.amount > 0 ? plus : minus} alt="" className="-mr-[2px] block max-w-none" />
                        <span>{Math.abs(item.amount)}톨</span>
                      </div>
                      <div aria-label={`거래 후 잔액 ${item.balance_after}톨`} className="text-b3-regular flex items-center text-gray-30">
                        <span className="flex size-[16px] items-center justify-center overflow-hidden" aria-hidden="true">
                          <img src={tol} alt="" className="block max-w-none rotate-[19.17deg]" />
                        </span>
                        <span>{item.balance_after}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {query.isFetchNextPageError && <p role="alert" className="text-b3-regular mt-4 px-2 text-gray-30">다음 내역을 불러오지 못했어요.</p>}
        {query.hasNextPage && <Button disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} className="text-b2-regular mt-4 w-full py-2">
          {query.isFetchingNextPage ? '불러오는 중…' : query.isFetchNextPageError ? '다시 시도' : '더 보기'}
        </Button>}
      </main>
    </div>
  )
}
