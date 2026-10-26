import { Navigate, useNavigate } from 'react-router-dom'
import { EnvelopeBack, EnvelopeFront } from '../../components/Envelope'
import VerdictSummary from '../../components/VerdictSummary'
import { paths } from '../../routes/paths'
import { useQuery } from '@tanstack/react-query'
import { getVerdict } from '../../apis/verdictApi'
import { toVerdictSummary, useCaseIdParam } from '../../hooks/useVerdict'
import { getApiErrorMessage, isApiStatus } from '../../utils/apiError'
import Button from '../../components/Button'
import CasePublicationActions from '../../components/CasePublicationActions'

function MyCaseDetailPage() {
  const navigate = useNavigate()
  const caseId = useCaseIdParam()
  const { data: verdict, isPending, isError, error, refetch } = useQuery({
    queryKey: ['verdict', caseId],
    queryFn: () => getVerdict(caseId!),
    enabled: caseId !== undefined,
    retry: (count, failure) => !isApiStatus(failure, 404) && count < 2,
  })
  if (caseId === undefined) return <Navigate to={paths.myCases} replace />
  if (isPending) return <p role="status" className="p-6 text-center text-white-100">판결문을 불러오는 중이에요.</p>
  if (isError || !verdict) return <div role="alert" className="p-6 text-center text-white-100"><p>{isApiStatus(error, 404) ? '사건을 찾을 수 없거나 아직 완료된 판결이 없어요.' : getApiErrorMessage(error)}</p><Button onClick={() => void refetch()} className="m-4">다시 시도</Button><Button onClick={() => navigate(paths.myCases, { replace: true })}>목록으로</Button></div>

  return (
    <section aria-label={`${verdict.title} 판결문`} className="h-[calc(100dvh-51px)] overflow-y-auto overscroll-y-contain @container">
      <div className="relative flex min-h-full flex-col overflow-clip pt-4.75">
        <div key={caseId} className="relative z-10 mx-auto w-98.25 shrink-0 motion-safe:animate-[verdict-reveal_850ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ zoom: 'min(1, calc(100cqw / 393px))' }}>
          <div className="absolute inset-y-0 left-6 w-86.25 rounded-lg bg-white-100" />
          <div className="relative mx-auto w-fit min-h-126.5 pt-9 pb-[29.8px]">
            <VerdictSummary
              size="card"
              {...toVerdictSummary(verdict)}
              oneLine={null}
              onWhyClick={() => navigate(paths.myCaseReason(caseId))}
            />
          </div>
        </div>
        <div className="relative mt-6 flex min-h-36 flex-1 flex-col justify-end px-6 pt-12 pb-6">
          <div className="pointer-events-none absolute inset-x-3.5 top-0">
            <EnvelopeBack className="relative h-[45.75px]" />
            <EnvelopeFront className="relative h-[497.93px]" />
          </div>
          <div className="relative z-20">
            <CasePublicationActions caseId={caseId} isPublic={verdict.is_public} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyCaseDetailPage
