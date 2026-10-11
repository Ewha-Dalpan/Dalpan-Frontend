// 마이 - 내 사건 상세 (판결문이 봉투에서 쓱 올라옴)
// 판결 내용은 VerdictSummary, 봉투는 Envelope 공통 컴포넌트 사용

import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { EnvelopeBack, EnvelopeFront } from '../../components/Envelope'
import VerdictSummary from '../../components/VerdictSummary'
import { paths } from '../../routes/paths'
import { exampleMyCases } from './exampleMyCases'

function MyCaseDetailPage() {
  const navigate = useNavigate()
  const { caseId } = useParams()
  const item = exampleMyCases.find((entry) => String(entry.id) === caseId)

  if (!item) return <Navigate to={paths.myCases} replace />

  return (
    <section aria-label={`${item.category} ${item.date} 접수 사건 판결문`} className="relative h-[calc(100dvh-51px)] overflow-clip pt-4.75 @container">
      {/* 판결문 카드 (key: 다른 사건으로 바뀌면 올라오는 모션 다시 재생) */}
      <div key={caseId} className="h-[min(506px,128.753181cqw)] motion-safe:animate-[verdict-reveal_850ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="relative h-126.5 w-98.25 origin-top-left scale-[min(1,calc(100cqw/393px))]">
          <div className="absolute inset-y-0 left-6 w-86.25 rounded-lg bg-white-100" />
          <div className="absolute top-9 left-1/2 -translate-x-1/2">
            {/* TODO: API 연동 시 사건 번호·관계 교체 */}
            <VerdictSummary size="card" caseNumber="月 제0241호" relation="연인" title={item.title} onWhyClick={() => navigate(paths.myCaseReason(item.id))} />
          </div>
        </div>
      </div>

      {/* 봉투 (카드보다 앞에 둬서 카드가 봉투 뒤에서 올라오는 것처럼 보임) */}
      <div className="relative z-10 mt-6 mr-3.25 ml-3.5">
        <EnvelopeBack className="relative h-[45.75px]" />
        <EnvelopeFront className="relative h-[497.93px]" />
      </div>
    </section>
  )
}

export default MyCaseDetailPage
