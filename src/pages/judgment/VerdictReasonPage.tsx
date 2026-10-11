// AI 재판 - '왜 이렇게 판단했을까?' (판단 근거 상세)
// 판결문 전체 화면 / 마이 > 내 사건 상세 두 페이지에서 동일하게 사용!!

import { useId, useState } from 'react'
import chevronDown from '../../assets/verdict/chevron-down.svg'
import dot from '../../assets/verdict/dot.svg'
import referenceLink from '../../assets/verdict/reference-link.svg'
import sageLogo from '../../assets/verdict/sage-logo.png'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { useGoBack } from '../../hooks/useGoBack'

type Reference = {
  summary: string // 참고한 연구 내용 요약
  source: string // 출처 기관명
  logo: string
  title: string // 논문 제목
  credit: string // 저자, 발행연도
  url: string // 원문 링크
}

type Reason = {
  title: string
  description: string
  reference: Reference | null // 적절한 참고 자료가 없으면 '왜 이게 판단 기준인가요?' 자체를 숨김
}

// TODO: API 연동 시 사건의 판단 근거로 교체
const mockCase = { caseNumber: '月 제0241호', relation: '연인' }
const mockReasons: Reason[] = [
  {
    title: '약속 전 연락 공백',
    description: '회신이 예정된 상황에서 장시간 연락이 끊기며 상대에게 일정의 불확실성을 만든 점',
    reference: {
      summary:
        '답장 지연은 지난 시간보다 기대한 응답 시간과의 차이로 받아들여지며, 일정 조율이나 갈등 상황에서는 더 부정적으로 받아들여진다는 연구가 있어요.',
      source: 'Sage Journals',
      logo: sageLogo,
      title: '답장이 없나요? 기술 매개 연애 갈등에서의 응답 시간 기대 위반과 관계적 혼란',
      credit: 'Huang & Yao, 2024',
      url: 'https://journals.sagepub.com', // TODO: 논문 원문 주소로 교체
    },
  },
  {
    title: '관계에서의 응답성',
    description: '평소 연락을 주고받던 패턴과 비교했을 때 응답이 느려진 정도',
    // 가짜 데이터 (실제 논문 아님, 화면 확인용)
    reference: {
      summary:
        '평소보다 답장이 느려지면 상대는 관심이 줄었다고 받아들이기 쉽고, 이런 응답성의 변화가 관계 만족도와 신뢰에 영향을 준다는 연구가 있어요.',
      source: 'Sage Journals',
      logo: sageLogo,
      title: '연인 간 메시지 응답 패턴의 변화와 인식된 관계 응답성',
      credit: 'Kim & Lee, 2023',
      url: 'https://journals.sagepub.com', // TODO: 논문 원문 주소로 교체
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
                    <span className="relative size-5 shrink-0 overflow-hidden rounded-[6.667px]">
                      <img src={reference.logo} alt="" className="absolute top-1/2 left-[0.77px] size-[55.385px] max-w-none -translate-y-1/2 object-cover" />
                    </span>
                    {reference.source}
                  </span>
                  <span className="text-l2-medium mt-2.25 block text-gray-90">{reference.title}</span>
                  <span className="mt-1 block text-[9.1px] leading-normal tracking-[-0.03em] text-gray-50">{reference.credit}</span>
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
  const goBack = useGoBack() // 들어온 화면으로 돌아가기

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-bg-light pb-10">
      <Header depth={2} theme="light" title="왜 이렇게 판단했을까?" onBack={goBack} />
      {/* 사건 번호/관계 */}
      <p className="text-l1-regular relative -mt-2.5 flex items-center justify-center gap-2 text-gray-50">
        {mockCase.caseNumber}
        <img src={dot} alt="" className="block max-w-none" />
        {mockCase.relation}
      </p>

      <main className="px-5.5">
        <h2 className="text-h4-semibold mt-9.5 px-0.5 text-gray-90">AI 판사의 판결에는 이런 근거들이 있어요</h2>
        <ul className="mt-7.75 flex flex-col gap-4.5">
          {mockReasons.map((reason) => (
            <ReasonCard key={reason.title} reason={reason} />
          ))}
        </ul>
      </main>
    </div>
  )
}

export default VerdictReasonPage
