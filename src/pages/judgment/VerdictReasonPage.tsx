// AI 재판 - '왜 이렇게 판단했을까?' (판단 근거 상세)
// 판결문 전체 화면 / 마이 > 내 사건 상세 / 공유 받은 판결문 세 곳에서 동일하게 사용!!

import { useId, useState } from 'react'
import { Navigate, useMatch, useParams } from 'react-router-dom'
import chevronDown from '../../assets/verdict/chevron-down.svg'
import dot from '../../assets/verdict/dot.svg'
import referenceLink from '../../assets/verdict/reference-link.svg'
import sageLogo from '../../assets/verdict/sage-logo.png'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { useGoBack } from '../../hooks/useGoBack'
import { formatCaseNumber, useCaseIdParam, useVerdict } from '../../hooks/useVerdict'
import { paths } from '../../routes/paths'
import type { PublicFactor, VerdictSource } from '../../types/verdict'

type Reference = {
  summary: string // 이 자료를 판단에 참고한 이유
  source: string // 출처 (발행처)
  logo: string | null // 출처 로고 (없으면 출처 첫 글자)
  title: string // 논문 · 기사 제목
  credit: string // 저자, 발행연도 (없으면 빈 문자열)
  url: string // 원문 링크
}

type Reason = {
  id: number | string
  title: string
  description: string
  reference: Reference | null // 적절한 참고 자료가 없으면 '왜 이게 판단 기준인가요?' 자체를 숨김
}

// 저자 + 발행연도 (예: Huang & Yao, 2024 / Kim 외 3명, 2023)
const formatCredit = ({ authors, published_date }: VerdictSource) => {
  const names =
    authors.length > 2 ? `${authors[0]} 외 ${authors.length - 1}명` : authors.join(' & ')
  const year = published_date.slice(0, 4)
  return [names, year].filter(Boolean).join(', ')
}

// 판단 요소 → 카드 (참고 출처가 있을 때만 펼치기)
const toReason = (factor: PublicFactor): Reason => {
  const { source } = factor
  return {
    id: factor.id,
    title: factor.name,
    description: factor.summary,
    reference:
      factor.can_expand && source
        ? {
            summary: source.reference_summary,
            source: source.publisher || (source.kind === 'SCHOLAR' ? '논문' : '기사'),
            logo: /sage/i.test(source.publisher) ? sageLogo : null, // 로고 이미지는 Sage만 있음
            title: source.title,
            credit: formatCredit(source),
            url: source.url,
          }
        : null,
  }
}

// TODO: 공유 판결 API 연동 시(이슈 5) 공유 받은 판결의 판단 근거로 교체 (지금은 공유 화면도 예시 데이터)
const mockShared = { caseNumber: '月 제0241호', relation: '연인' }
const mockSharedReasons: Reason[] = [
  {
    id: 1,
    title: '약속 전 연락 공백',
    description: '회신이 예정된 상황에서 장시간 연락이 끊기며 상대에게 일정의 불확실성을 만든 점',
    reference: {
      summary:
        '답장 지연은 지난 시간보다 기대한 응답 시간과의 차이로 받아들여지며, 일정 조율이나 갈등 상황에서는 더 부정적으로 받아들여진다는 연구가 있어요.',
      source: 'Sage Journals',
      logo: sageLogo,
      title: '답장이 없나요? 기술 매개 연애 갈등에서의 응답 시간 기대 위반과 관계적 혼란',
      credit: 'Huang & Yao, 2024',
      url: 'https://journals.sagepub.com',
    },
  },
]

// 판단 요소 카드 (참고 자료는 접었다 펼 수 있음, 기본은 접힘)
function ReasonCard({ reason }: { reason: Reason }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const { reference } = reason

  return (
    <li className="rounded-lg bg-white-100 px-4 py-3.5">
      <h3 className="text-b1-semibold text-gray-100">{reason.title}</h3>
      <p className="text-b2-regular mt-1 text-gray-100">{reason.description}</p>

      {reference && (
        <>
          <Button
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-b3-medium mt-1.75 flex w-full cursor-pointer items-center justify-between border-t border-keycolor-20 pt-1.75 text-keycolor-100"
          >
            왜 이게 판단 기준인가요?
            <img src={chevronDown} alt="" className={`block max-w-none transition-transform duration-200 motion-reduce:transition-none ${isOpen ? '-scale-y-100' : ''}`} />
          </Button>

          <div
            id={panelId}
            className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden" inert={!isOpen}>
              <div className="mt-2.75 rounded-lg bg-gray-5 p-2.5">
                <div className="px-2">
                  <p className="text-b3-semibold flex items-center gap-2 text-gray-60">
                    <img src={referenceLink} alt="" className="block max-w-none" />이 판단에 참고한 자료
                  </p>
                  <p className="text-l1-medium mt-2 text-gray-60">{reference.summary}</p>
                </div>

                {/* 출처 카드: 누르면 원문으로 */}
                <a href={reference.url} target="_blank" rel="noreferrer" className="mt-2.25 block rounded-lg bg-white-100 p-2.5">
                  <span className="text-l1-medium flex items-center gap-0.5 text-black">
                    <span className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[6.667px] bg-gray-10 text-[11px] font-semibold text-gray-60">
                      {reference.logo ? (
                        <img src={reference.logo} alt="" className="absolute top-1/2 left-[0.77px] size-[55.385px] max-w-none -translate-y-1/2 object-cover" />
                      ) : (
                        <span aria-hidden="true">{reference.source.charAt(0)}</span>
                      )}
                    </span>
                    {reference.source}
                  </span>
                  <span className="text-l2-medium mt-2.25 block text-gray-90">{reference.title}</span>
                  {reference.credit && (
                    <span className="mt-1 block text-[9.1px] leading-normal tracking-[-0.03em] text-gray-50">{reference.credit}</span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </li>
  )
}

function VerdictReasonPage() {
  // 공유 받은 사람이면 주소에 shareId가 있음
  const { shareId } = useParams()
  const isMyCase = useMatch(paths.myCaseReasonPattern) !== null // 마이 > 내 사건 상세에서 들어옴

  // 판결문 · 내 사건에서 들어오면 주소의 사건 ID로 판결 불러오기 (공유 받은 사람은 제외)
  const caseId = useCaseIdParam()
  const { data: verdict, isError } = useVerdict(shareId ? undefined : caseId)

  // 링크로 바로 들어와 이전 화면이 없으면: 공유 판결문 / 내 사건 상세 / 판결문 전체로
  const fallback = shareId
    ? paths.sharedVerdict(shareId)
    : caseId === undefined
      ? paths.home
      : isMyCase
        ? paths.myCaseDetail(caseId)
        : paths.verdictResult(caseId)
  const goBack = useGoBack(fallback) // 들어온 화면으로 돌아가기

  if (!shareId) {
    if (caseId === undefined) return <Navigate to={paths.home} replace />
    if (isError) return <Navigate to={paths.home} replace state={{ toast: '판결문을 불러오지 못했어요.' }} />
  }

  // 판단 요소: 내 과실 근거 → 상대 과실 근거 순서
  const reasons = shareId
    ? mockSharedReasons
    : verdict
      ? [...verdict.self_factors, ...verdict.other_factors].map(toReason)
      : null
  const caseNumber = shareId ? mockShared.caseNumber : verdict ? formatCaseNumber(verdict.case_number) : ''
  const relation = shareId ? mockShared.relation : (verdict?.relation ?? '')

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-bg-light pb-10">
      <Header depth={2} theme="light" title="왜 이렇게 판단했을까?" onBack={goBack} />
      {/* 사건 번호/관계 */}
      <p className="text-l1-regular relative -mt-2.5 flex min-h-4.75 items-center justify-center gap-2 text-gray-50">
        {caseNumber && (
          <>
            {caseNumber}
            <img src={dot} alt="" className="block max-w-none" />
            {relation}
          </>
        )}
      </p>

      <main className="px-5.5">
        <h2 className="text-h4-semibold mt-9.5 px-0.5 text-gray-90">AI 판사의 판결에는 이런 근거들이 있어요</h2>
        {reasons ? (
          <ul className="mt-7.75 flex flex-col gap-4.5">
            {reasons.map((reason) => (
              <ReasonCard key={reason.id} reason={reason} />
            ))}
          </ul>
        ) : (
          <p role="status" className="text-b2-regular mt-10 text-center text-gray-70">
            판단 근거를 불러오는 중이에요
          </p>
        )}
      </main>
    </div>
  )
}

export default VerdictReasonPage
