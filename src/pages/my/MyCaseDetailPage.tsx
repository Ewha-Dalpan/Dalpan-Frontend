import { Navigate, useNavigate } from 'react-router-dom'
import { EnvelopeBack, EnvelopeFront } from '../../components/Envelope'
import VerdictSummary from '../../components/VerdictSummary'
import { paths } from '../../routes/paths'
import { useQuery } from '@tanstack/react-query'
import { getVerdict } from '../../apis/verdictApi'
import { toVerdictSummary, useCaseIdParam } from '../../hooks/useVerdict'
import { getApiErrorMessage, isApiStatus } from '../../utils/apiError'
import Button from '../../components/Button'

function MyCaseDetailPage() {
  const navigate = useNavigate()
  const caseId = useCaseIdParam()
  const { data: verdict, isPending, isError, error, refetch } = useQuery({
    queryKey: ['verdict', caseId],
    queryFn: () => getVerdict(caseId!),
    enabled: caseId !== undefined,
    staleTime: 0,
    retry: (count, failure) => !isApiStatus(failure, 404) && count < 2,
  })
  if (caseId === undefined) return <Navigate to={paths.myCases} replace />
  if (isPending) return <p role="status" className="p-6 text-center text-white-100">판결문을 불러오는 중이에요.</p>
  if (isError || !verdict) return <div role="alert" className="p-6 text-center text-white-100"><p>{isApiStatus(error, 404) ? '사건을 찾을 수 없거나 아직 완료된 판결이 없어요.' : getApiErrorMessage(error)}</p><Button onClick={() => void refetch()} className="m-4">다시 시도</Button><Button onClick={() => navigate(paths.myCases, { replace: true })}>목록으로</Button></div>

  return (
    <section aria-label={`${verdict.title} 판결문`} className="relative h-[calc(100dvh-51px)] overflow-clip pt-4.75 @container">
      <div key={caseId} className="h-[min(506px,128.753181cqw)] motion-safe:animate-[verdict-reveal_850ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="relative h-126.5 w-98.25 origin-top-left scale-[min(1,calc(100cqw/393px))]">
          <div className="absolute inset-y-0 left-6 w-86.25 rounded-lg bg-white-100" />
          <div className="absolute top-9 left-1/2 -translate-x-1/2">
            <VerdictSummary
              size="card"
              {...toVerdictSummary(verdict)}
              onWhyClick={() => navigate(paths.myCaseReason(caseId))}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 mr-3.25 ml-3.5">
        <EnvelopeBack className="relative h-[45.75px]" />
        <EnvelopeFront className="relative h-[497.93px]" />
      </div>
    </section>
  )
}

export default MyCaseDetailPage
