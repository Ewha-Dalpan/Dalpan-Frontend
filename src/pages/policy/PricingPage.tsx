// 서비스 안내 · 가격 (로그인 없이 볼 수 있음, 한국어 /pricing · 영문 /en/pricing)
// Paddle 심사: 무엇을 파는지(서비스 설명, 받는 것)와 가격이 로그인 없이 보여야 함
// 가격 목록은 이용권 충전 화면과 같은 모양 (결제 버튼만 없음)

import { Link } from 'react-router-dom'
import divider from '../../assets/payment/divider.svg'
import Header from '../../components/Header'
import TollIcon from '../../components/TollIcon'
import { useAuth } from '../../hooks/useAuth'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import type { PolicyLang } from './operator'
import PolicyFooter from './PolicyFooter'
import { PRICING_COPY, PRICING_PRODUCTS } from './pricingCopy'

function PricingPage({ lang = 'ko' }: { lang?: PolicyLang }) {
  const goBack = useGoBack(paths.login)
  const { isLoggedIn } = useAuth()
  const copy = PRICING_COPY[lang]

  return (
    <div lang={lang} className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-bg text-white-100">
      <Header depth={2} title={copy.title} onBack={goBack} />
      <main className="px-6 pt-3">
        <section aria-labelledby="pricing-intro">
          <h2 id="pricing-intro" className="text-h3-medium">{copy.headline}</h2>
          <p className="text-b3-regular mt-1.5 text-gray-10">{copy.description}</p>
          <ul className="mt-4 flex flex-col gap-4 rounded-lg bg-[#3b3d56]/30 p-4">
            {copy.features.map(({ title, body }) => (
              <li key={title}>
                <h3 className="text-b3-medium">{title}</h3>
                <p className="text-l2-medium mt-1.5 leading-4">{body}</p>
              </li>
            ))}
          </ul>
          {/* 법적·사실 판단이 아니라는 안내 */}
          <p className="text-l2-medium mt-3 leading-4 text-gray-30">{copy.disclaimer}</p>
        </section>

        <section aria-labelledby="pricing-list" className="mt-9">
          <h2 id="pricing-list" className="text-h3-medium">{copy.pricingTitle}</h2>
          {/* 결제 대상은 이용권뿐, 배심원석은 무료 */}
          <p className="text-b3-regular mt-1.5 text-gray-10">{copy.pricingSummary}</p>

          {/* 목록 헤더와 상품 카드는 이용권 충전 화면과 같은 모양 */}
          <div className="text-l1-medium mt-3 flex h-13 items-center justify-between rounded-lg bg-white-100 pr-4.5 pl-4.25 text-[#343434]">
            <span>{copy.listHeader[0]}</span>
            <span>{copy.listHeader[1]}</span>
          </div>
          <div className="mt-3 rounded-lg bg-white-100 pt-4.75 pr-4.5 pb-5.75 pl-3">
            <ul className="flex flex-col gap-4.5">
              {PRICING_PRODUCTS.map(({ amount, bonus, price }) => (
                <li key={amount}>
                  <div className="flex h-6.75 items-center justify-between pl-0.75">
                    <span className="flex items-center gap-1.25">
                      <TollIcon />
                      <span className="text-b2-semibold text-gray-90">{copy.amount(amount)}</span>
                      {bonus > 0 && <span className="text-l2-medium text-[#ff5634]">{copy.bonus(bonus)}</span>}
                    </span>
                    <span className="text-b2-semibold text-gray-90">{copy.price(price)}</span>
                  </div>
                  <img src={divider} alt="" className="mt-3.25 -mb-px block max-w-none" />
                </li>
              ))}
            </ul>
          </div>

          <ul className="text-l2-medium mt-4 flex list-disc flex-col gap-1.5 pl-4 leading-4 text-gray-10">
            {copy.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
            <li>
              {copy.refundNote.text}{' '}
              <Link to={copy.refundNote.to} className="underline underline-offset-2">{copy.refundNote.linkLabel}</Link>
            </li>
          </ul>
        </section>

        {/* 로그인 안 했으면 로그인 화면으로, 했으면 홈으로 */}
        <Link
          to={isLoggedIn ? paths.home : paths.login}
          className="text-b1-semibold mt-9 flex h-12.5 w-full items-center justify-center rounded-lg bg-keycolor-100 text-white-100 transition-[scale] duration-200 ease-out hover:scale-[1.03] motion-reduce:transition-none"
        >
          {copy.start}
        </Link>
      </main>
      <PolicyFooter lang={lang} switchTo={copy.switchTo} className="mt-auto px-6 pt-10 pb-9" />
    </div>
  )
}

export default PricingPage
