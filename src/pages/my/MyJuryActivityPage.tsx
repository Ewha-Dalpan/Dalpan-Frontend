import Button from '../../components/Button'
import stamp from '../../assets/my/jury-activity/stamp.png'
import arrow from '../../assets/my/jury-activity/arrow.svg'

const exampleActivities = [
  { id: 1, category: '연애', title: ['약속 당일 4시간 연락이 없었는데,', '제가 예민한 건가요?'], authorRatio: 20, barWidth: 97, rightInset: 13, date: '2026. 9. 17', dateTime: '2026-09-17' },
  { id: 2, category: '직장/학교', title: ['매번 회의에 늦는 팀원, 제가 너무', '예민한가요?'], authorRatio: 25, barWidth: 111, rightInset: 11, date: '2026. 9. 14', dateTime: '2026-09-14' },
]

function MyJuryActivityPage() {
  return (
    <section aria-label="배심 활동 내역" className="mx-[24px] flex flex-col gap-[11px] pt-[11px]">
      {exampleActivities.map((activity) => (
        <article key={activity.id} aria-label={activity.title.join(' ')} className="relative h-[210px] overflow-hidden rounded-[20px] bg-white-100">
          <div className="absolute left-[18px] top-[20px] flex w-[204px] max-w-[calc(100%-36px)] flex-col items-start gap-[3px]">
            <span className="text-l1-medium rounded-[50px] bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">{activity.category}</span>
            <h2 className="text-b1-medium text-gray-90">{activity.title[0]}<br />{activity.title[1]}</h2>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute left-[calc(50%+114.39px)] top-[-26px] flex h-[178.473px] w-[129.776px] -translate-x-1/2 items-center justify-center">
            <img src={stamp} alt="" className="h-[160.277px] w-[91.408px] max-w-none rotate-[15deg] object-cover" />
          </div>
          <p className="text-l1-regular absolute left-[18px] top-[109px] text-gray-50">내가 내린 판결</p>
          <div aria-label={`작성자 ${activity.authorRatio}%, 상대 ${100 - activity.authorRatio}%`} className="text-b3-regular absolute left-[18px] right-[21px] top-[131px] flex h-[34px] overflow-hidden rounded-[8px]">
            <div className="relative h-full bg-keycolor-70 text-white-100" style={{ width: `${activity.barWidth / 306 * 100}%` }}>
              <span className="absolute left-[13px] top-[7px] flex gap-[2px] whitespace-nowrap">작성자 <strong className="font-semibold">{activity.authorRatio}%</strong></span>
            </div>
            <div className="relative h-full flex-1 bg-keycolor-5 text-gray-80">
              <span className="absolute top-[7px] flex gap-[3px] whitespace-nowrap" style={{ right: activity.rightInset }}>상대 <strong className="font-semibold">{100 - activity.authorRatio}%</strong></span>
            </div>
          </div>
          <time dateTime={activity.dateTime} className="text-l1-regular absolute left-[21px] top-[175px] text-gray-50">{activity.date}</time>
          <Button aria-disabled="true" className="text-l1-regular absolute right-[14px] top-[175px] flex items-center text-gray-50">
            글 바로가기<img src={arrow} alt="" className="block max-w-none shrink-0" />
          </Button>
        </article>
      ))}
    </section>
  )
}

export default MyJuryActivityPage
