import { useState } from 'react'
import participants from '../../assets/jury/participants.svg'
import comment from '../../assets/jury/explore/comment.svg'
import JuryFilterDropdown from './JuryFilterDropdown'

const categories = ['전체', '연애', '친구', '가족', '직장·학교', '기타'] as const
const sortOptions = ['최신순', '인기순'] as const

const exampleCases = [
  { id: 1, category: '연애', title: ['약속 당일 4시간 연락이 없었는데,', '제가 예민한 건가요?'], participants: 128, comments: 21, popularRank: 1, createdOrder: 1 },
  { id: 2, category: '친구', title: ['제 생일은 넘어가고', '자기 생일 선물은 챙겨달라는 친구'], participants: 96, comments: 10, popularRank: 2, createdOrder: 2 },
  { id: 3, category: '직장·학교', title: ['팀플 단톡방에서 제 의견만 계속', '무시돼요. 제가 예민한 걸까요?'], participants: 32, comments: 21, popularRank: 3, createdOrder: 3 },
  { id: 4, category: '가족', title: ['부모님이 제 진로 얘기만 나오면', '비교하세요.'], participants: 71, comments: 7, popularRank: 4, createdOrder: 4 },
]

function JuryExplorePage() {
  const [category, setCategory] = useState('전체')
  const [sort, setSort] = useState('인기순')
  const [openFilter, setOpenFilter] = useState<'category' | 'sort' | null>(null)
  const cases = exampleCases
    .filter((item) => category === '전체' || item.category === category)
    .sort((a, b) => sort === '인기순' ? a.popularRank - b.popularRank : b.createdOrder - a.createdOrder)

  return (
    <section aria-label="사건 탐색" className="pt-[12px]">
      <div className="mx-[24px] flex items-start gap-[8px]">
        <JuryFilterDropdown label="카테고리" value={category} options={categories}
          open={openFilter === 'category'} onOpenChange={(open) => setOpenFilter(open ? 'category' : null)} onChange={setCategory} />
        <JuryFilterDropdown label="정렬" value={sort} options={sortOptions}
          open={openFilter === 'sort'} onOpenChange={(open) => setOpenFilter(open ? 'sort' : null)} onChange={setSort} />
      </div>
      <ul aria-label="사건 목록" className="mt-[12px]">
        {cases.map((item) => (
          <li key={item.id} className="not-first:pt-[3px]">
            <article className="flex items-center gap-[5px] px-[24px] py-[16px]">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
                <span className="text-l1-medium rounded-[50px] bg-sub px-[8px] py-[4px]">{item.category}</span>
                <div className="flex w-full flex-col gap-[7px] px-[2px]">
                  <h2 className="text-b2-medium">{item.title[0]}<br />{item.title[1]}</h2>
                  <div className="text-l1-medium flex flex-wrap items-start gap-[7px] text-gray-50">
                    <span className="flex items-center gap-[2px] whitespace-nowrap">
                      <span className="relative size-[16px] shrink-0">
                        <img src={participants} alt="" className="absolute left-[8.17%] top-[8.33%] block max-w-none" />
                      </span>
                      {item.participants}명 참여
                    </span>
                    <span className="flex items-center gap-[2px] whitespace-nowrap">
                      <img src={comment} alt="" className="block shrink-0 max-w-none" />
                      댓글 수 {item.comments}
                    </span>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="size-[105px] shrink-0 rounded-[8px] bg-gray-5" />
            </article>
            <div className="mx-[10px] mt-[3px] h-px bg-sub" />
          </li>
        ))}
      </ul>
      {cases.length === 0 && <p role="status" className="text-b2-regular px-[24px] py-[16px] text-gray-50">해당 카테고리의 사건이 없습니다.</p>}
    </section>
  )
}

export default JuryExplorePage
