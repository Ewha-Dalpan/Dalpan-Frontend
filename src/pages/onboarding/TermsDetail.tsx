// 약관 상세 화면 ('보기'를 누르면 회원가입 화면 위에 열림)
// 동의하기 → 해당 항목을 체크하고 약관 동의 화면으로 돌아감

import { TERMS, type TermsKey } from './terms'

type TermsDetailProps = {
  termsKey: TermsKey
  onAgree: () => void
}

function TermsDetail({ termsKey, onAgree }: TermsDetailProps) {
  const { title, sections } = TERMS[termsKey]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-bg text-white-100">
      <div className="px-5.5 pt-12.5">
        <h1 className="text-h2-semibold">{title}</h1>
        <p className="text-b3-regular mt-3.5">아래 내용을 확인하고 동의해주세요</p>

        <div className="mt-3 flex flex-col gap-4 rounded-lg bg-[#3b3d56]/30 p-4">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-b3-medium">{section.title}</h2>
              <p className="text-l2-medium mt-4.5 leading-4">{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      {/* 본문이 길어도 버튼은 화면 아래에 붙어 있게 */}
      <div className="sticky bottom-0 mt-auto bg-bg px-6 pt-6 pb-9">
        <button
          type="button"
          onClick={onAgree}
          className="text-b1-semibold h-12.5 w-full cursor-pointer rounded-lg bg-keycolor-100 text-white-100 transition-[scale] duration-200 ease-out hover:scale-[1.03] motion-reduce:transition-none"
        >
          동의하기
        </button>
      </div>
    </main>
  )
}

export default TermsDetail
