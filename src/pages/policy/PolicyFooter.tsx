// 서비스 안내 · 정책 링크와 운영자 정보 (로그인 화면, 정책 페이지 아래)
// Paddle 심사: 가격 · 약관 · 환불 정책 · 개인정보처리방침이 로그인 없이 링크로 보여야 함
// switchTo: 언어 바꾸기 링크가 갈 곳 (지금 페이지의 다른 언어 버전)

import { Link } from 'react-router-dom'
import { paths } from '../../routes/paths'
import { OPERATOR, type PolicyLang } from './operator'

const COPY = {
  ko: {
    label: '서비스 안내 및 정책',
    links: [
      { to: paths.pricing, label: '서비스 안내 · 가격' },
      { to: paths.terms, label: '이용약관' },
      { to: paths.refund, label: '환불 정책' },
      { to: paths.privacy, label: '개인정보처리방침' },
    ],
    switchLabel: 'English',
    operator: `${OPERATOR.service} · 운영자 ${OPERATOR.name}`,
  },
  en: {
    label: 'Service information and policies',
    links: [
      { to: paths.pricingEn, label: 'Pricing' },
      { to: paths.termsEn, label: 'Terms of Service' },
      { to: paths.refundEn, label: 'Refund Policy' },
      { to: paths.privacyEn, label: 'Privacy Policy' },
    ],
    switchLabel: '한국어',
    operator: `${OPERATOR.serviceEn} · Operated by ${OPERATOR.name}`,
  },
} satisfies Record<PolicyLang, unknown>

type PolicyFooterProps = {
  lang?: PolicyLang
  switchTo: string
  className?: string
}

function PolicyFooter({ lang = 'ko', switchTo, className = '' }: PolicyFooterProps) {
  const copy = COPY[lang]

  return (
    <footer className={`flex flex-col items-center gap-1.5 text-center ${className}`}>
      <nav aria-label={copy.label}>
        <ul className="text-l2-medium flex flex-wrap justify-center gap-x-3 gap-y-1 text-white-100">
          {copy.links.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="underline-offset-2 hover:underline">{label}</Link>
            </li>
          ))}
          <li>
            <Link to={switchTo} lang={lang === 'ko' ? 'en' : 'ko'} className="underline underline-offset-2">{copy.switchLabel}</Link>
          </li>
        </ul>
      </nav>
      <p className="text-l2-regular text-gray-10">
        {copy.operator} ·{' '}
        <a href={`mailto:${OPERATOR.email}`} className="underline-offset-2 hover:underline">{OPERATOR.email}</a>
      </p>
    </footer>
  )
}

export default PolicyFooter
