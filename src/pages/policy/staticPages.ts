// 서비스 안내 · 정책 페이지를 빌드할 때 내용이 들어간 정적 HTML로도 만듦 (vite.config.ts의 prerender 플러그인이 씀)
// Paddle 심사 스캐너는 자바스크립트를 실행하지 않아서, 빈 <div id="root">만 있으면 '공사 중인 사이트'로 판단함
// 화면이 뜨면 React가 #root를 원래 화면으로 바꿈

import { TERMS, type TermsSection } from '../onboarding/terms'
import { paths } from '../../routes/paths'
import { OPERATOR, type PolicyLang } from './operator'
import { PRIVACY_POLICY, REFUND_POLICY } from './policies'
import { PRIVACY_POLICY_EN, REFUND_POLICY_EN, TERMS_EN } from './policiesEn'
import { PRICING_COPY, PRICING_PRODUCTS } from './pricingCopy'

export type StaticPage = {
  file: string // dist 안의 파일 경로
  lang: PolicyLang
  title: string // <title>
  description: string // <meta name="description">
  body: string // #root 안에 넣을 HTML
}

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const FOOTER_LINKS: Record<PolicyLang, { to: string; label: string }[]> = {
  ko: [
    { to: paths.pricing, label: '서비스 안내 · 가격' },
    { to: paths.terms, label: '이용약관' },
    { to: paths.refund, label: '환불 정책' },
    { to: paths.privacy, label: '개인정보처리방침' },
    { to: paths.pricingEn, label: 'English' },
  ],
  en: [
    { to: paths.pricingEn, label: 'Pricing' },
    { to: paths.termsEn, label: 'Terms of Service' },
    { to: paths.refundEn, label: 'Refund Policy' },
    { to: paths.privacyEn, label: 'Privacy Policy' },
    { to: paths.pricing, label: '한국어' },
  ],
}

const footer = (lang: PolicyLang) => {
  const links = FOOTER_LINKS[lang].map(({ to, label }) => `<li><a href="${to}">${escape(label)}</a></li>`).join('')
  const operator = lang === 'ko' ? `${OPERATOR.service} · 운영자 ${OPERATOR.name}` : `${OPERATOR.serviceEn} · Operated by ${OPERATOR.name}`
  return `<footer class="mt-10 text-l2-medium text-gray-10"><nav><ul class="flex flex-wrap gap-x-3 gap-y-1">${links}</ul></nav><p class="mt-1.5">${escape(operator)} · <a href="mailto:${OPERATOR.email}">${OPERATOR.email}</a></p></footer>`
}

const layout = (lang: PolicyLang, title: string, content: string) =>
  `<div class="mx-auto min-h-dvh w-full max-w-98.25 bg-bg px-6 py-8 text-white-100"><h1 class="text-b1-semibold">${escape(title)}</h1>${content}${footer(lang)}</div>`

const pricingBody = (lang: PolicyLang) => {
  const copy = PRICING_COPY[lang]
  const features = copy.features.map(({ title, body }) => `<li><h3 class="text-b3-medium">${escape(title)}</h3><p class="text-l2-medium">${escape(body)}</p></li>`).join('')
  const products = PRICING_PRODUCTS.map(({ amount, bonus, price }) =>
    `<li>${escape(copy.amount(amount))}${bonus > 0 ? ` ${escape(copy.bonus(bonus))}` : ''} — ${escape(copy.price(price))}</li>`,
  ).join('')
  const notes = copy.notes.map((note) => `<li>${escape(note)}</li>`).join('')
  const refund = `<li>${escape(copy.refundNote.text)} <a href="${copy.refundNote.to}">${escape(copy.refundNote.linkLabel)}</a></li>`
  return layout(
    lang,
    copy.title,
    `<section class="mt-4"><h2 class="text-h3-medium">${escape(copy.headline)}</h2><p class="text-b3-regular">${escape(copy.description)}</p><ul class="mt-4 flex flex-col gap-4">${features}</ul></section>` +
      `<section class="mt-9"><h2 class="text-h3-medium">${escape(copy.pricingTitle)}</h2><ul class="text-b3-medium mt-3 flex flex-col gap-1.5">${products}</ul><ul class="text-l2-medium mt-4 flex flex-col gap-1.5">${notes}${refund}</ul></section>` +
      `<p class="mt-9"><a href="${paths.login}">${escape(copy.start)}</a></p>`,
  )
}

const policyBody = (lang: PolicyLang, title: string, sections: TermsSection[]) =>
  layout(
    lang,
    title,
    `<div class="mt-4 flex flex-col gap-4">${sections.map(({ title, body }) => `<section><h2 class="text-b3-medium">${escape(title)}</h2><p class="text-l2-medium">${escape(body)}</p></section>`).join('')}</div>`,
  )

const policy = (file: string, lang: PolicyLang, title: string, description: string, sections: TermsSection[]): StaticPage => ({
  file,
  lang,
  title: `${title} | Dalpan`,
  description,
  body: policyBody(lang, title, sections),
})

const pricing = (file: string, lang: PolicyLang): StaticPage => ({
  file,
  lang,
  title: `${PRICING_COPY[lang].title} | Dalpan`,
  description: PRICING_COPY[lang].description,
  body: pricingBody(lang),
})

export const STATIC_PAGES: StaticPage[] = [
  // 도메인 첫 화면: 해외 심사팀이 바로 읽을 수 있게 영문 서비스 안내 (화면이 뜨면 로그인 여부에 따라 이동)
  pricing('index.html', 'en'),
  pricing('pricing.html', 'ko'),
  pricing('en/pricing.html', 'en'),
  policy('terms.html', 'ko', '서비스 이용약관', '달판 서비스 이용약관', TERMS.terms.sections),
  policy('en/terms.html', 'en', 'Terms of Service', 'Dalpan Terms of Service', TERMS_EN),
  policy('refund.html', 'ko', '환불 정책', '달판 환불 정책', REFUND_POLICY),
  policy('en/refund.html', 'en', 'Refund Policy', 'Dalpan Refund Policy', REFUND_POLICY_EN),
  policy('privacy.html', 'ko', '개인정보처리방침', '달판 개인정보처리방침', PRIVACY_POLICY),
  policy('en/privacy.html', 'en', 'Privacy Policy', 'Dalpan Privacy Policy', PRIVACY_POLICY_EN),
]
