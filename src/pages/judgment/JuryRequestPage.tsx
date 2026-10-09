// AI 재판 - 배심원에게도 물어보기 (배심원석 등록)

import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import chatSample from '../../assets/jury-request/chat-sample.png'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { useGoBack } from '../../hooks/useGoBack'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { paths } from '../../routes/paths'

// TODO: API 연동 시 진짜 사진으로 교체
const mockCase = {
  date: '2026. 9. 17',
  relation: '연애',
  title: '약속 직전 연락 공백 사건',
  captures: [chatSample, chatSample, chatSample],
}

// 대화 캡처 카드 한 칸 너비
const CAPTURE_STEP = 246

function JuryRequestPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const scrollHandlers = useHorizontalScroll(CAPTURE_STEP)
  const previewTitleId = useId()

  // 배심원석에 올리기 → 배심원석으로 
  // TODO: API 연동 시 배심원석 등록 요청 보내기
  const handleSubmit = () => {
    navigate(paths.jury, { replace: true, state: { toast: '배심원석에 사건을 올렸어요.' } })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-white-100 pb-8.5">
      <Header depth={2} theme="white" title="배심원석 등록" onBack={goBack} />

      <main className="flex flex-1 flex-col pt-2.75">
        <h2 className="text-h3-semibold px-6 text-gray-90">
          이 사건,
          <br />
          다른사람들은 어떻게 판단할까요?
        </h2>

        {/* 배심원들에게 보일 미리보기 */}
        <section aria-labelledby={previewTitleId} className="mt-3.5">
          <h3 id={previewTitleId} className="text-b2-medium px-6 text-gray-70">
            배심원들에게 이렇게 보여요
          </h3>
          <div className="mt-3.5 bg-[#f9f9f9] pt-6.5 pb-5.25">
            <p className="text-l2-regular text-center text-gray-30">{mockCase.date}</p>
            <div className="mt-2.25 flex flex-col items-center gap-0.5">
              <span className="text-l1-medium rounded-full bg-keycolor-5 px-2 py-1 text-keycolor-100">{mockCase.relation}</span>
              <p className="text-h3-semibold text-gray-90">{mockCase.title}</p>
            </div>

            {/* 대화 캡처는 가로 스크롤 가능~~ */}
            <ul
              tabIndex={0}
              aria-label="대화 캡처 (좌우로 넘겨보기)"
              {...scrollHandlers}
              className="scrollbar-none mt-5.5 flex cursor-grab gap-1 overflow-x-auto overscroll-x-contain px-7.75 select-none focus-visible:outline-2 focus-visible:outline-keycolor-40 active:cursor-grabbing"
            >
              {mockCase.captures.map((src, index) => (
                <li key={index} className="relative size-60.5 shrink-0 overflow-hidden rounded-[17.224px] bg-gray-10">
                  <div className="absolute top-0 left-[-11.26px] h-[241.559px] w-[263.116px] overflow-hidden rounded-[37.519px]">
                    <img src={src} alt={`대화 캡처 ${index + 1}`} draggable={false} className="absolute top-[-225.28px] left-0 w-full max-w-none" />
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-l1-regular mx-auto mt-9.75 w-58.75 text-center text-gray-50">
              AI가 내린 판결과 과실 비율은 공개되지 않아요. 배심원들은 사건 내용만 보고 직접 판단합니다.
            </p>
          </div>
        </section>

        <div className="mt-auto px-6 pt-6">
          <p className="text-l1-regular text-center text-gray-50">무료 · 올린 사건은 마이페이지에서 언제든 내릴 수 있어요</p>
          <Button variant="primary" fullWidth onClick={handleSubmit} className="mt-2.5 h-10">
            배심원석에 올리기
          </Button>
        </div>
      </main>
    </div>
  )
}

export default JuryRequestPage
