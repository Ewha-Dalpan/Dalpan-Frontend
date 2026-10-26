// 이용약관 · 환불 정책 · 개인정보처리방침 (로그인 없이 볼 수 있음, 한국어 · 영문)
// 본문 모양은 회원가입의 약관 상세 화면(TermsDetail)과 같게

import Header from '../../components/Header'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import type { TermsSection } from '../onboarding/terms'
import type { PolicyLang } from './operator'
import PolicyFooter from './PolicyFooter'

type PolicyPageProps = {
  title: string
  sections: TermsSection[]
  lang?: PolicyLang
  switchTo: string // 다른 언어 버전 주소
}

function PolicyPage({ title, sections, lang = 'ko', switchTo }: PolicyPageProps) {
  const goBack = useGoBack(paths.login)

  return (
    <div lang={lang} className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-bg text-white-100">
      <Header depth={2} title={title} onBack={goBack} />
      <main className="px-5.5 pt-3">
        <div className="flex flex-col gap-4 rounded-lg bg-[#3b3d56]/30 p-4">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-b3-medium">{section.title}</h2>
              <p className="text-l2-medium mt-4.5 leading-4">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <PolicyFooter lang={lang} switchTo={switchTo} className="mt-auto px-6 pt-10 pb-9" />
    </div>
  )
}

export default PolicyPage
