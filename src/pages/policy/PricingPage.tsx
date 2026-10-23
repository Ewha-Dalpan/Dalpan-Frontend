// 서비스 안내 · 가격 (로그인 없이 볼 수 있음, 한국어 /pricing · 영문 /en/pricing)
// Paddle 심사: 무엇을 파는지(서비스 설명, 받는 것)와 가격이 로그인 없이 보여야 함
// 가격 목록은 이용권 충전 화면과 같은 모양 (결제 버튼만 없음)

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import divider from '../../assets/payment/divider.svg'
import Header from '../../components/Header'
import TollIcon from '../../components/TollIcon'
import { useGoBack } from '../../hooks/useGoBack'
import { paths } from '../../routes/paths'
import { formatPrice } from '../payment/coinProduct'
import type { PolicyLang } from './operator'
import PolicyFooter from './PolicyFooter'

// 상품 API가 아직 화면설계서와 달라서 화면설계서 가격을 적어둠 (백엔드 상품이 맞춰지면 API로 교체)
const PRODUCTS = [
  { amount: 1, bonus: 0, price: 990 },
  { amount: 5, bonus: 0, price: 4950 },
  { amount: 10, bonus: 1, price: 9900 },
  { amount: 20, bonus: 3, price: 19800 },
  { amount: 50, bonus: 5, price: 49500 },
]

type PricingCopy = {
  title: string
  headline: string
  description: string
  features: { title: string; body: string }[]
  pricingTitle: string
  listHeader: [string, string]
  amount: (amount: number) => string
  bonus: (bonus: number) => string
  price: (price: number) => string
  notes: ReactNode[]
  switchTo: string
}

const COPY: Record<PolicyLang, PricingCopy> = {
  ko: {
    title: '서비스 안내',
    headline: '내가 예민한 걸까?',
    description: '헷갈리는 관계 속 갈등, 달판이 상황과 대화를 보고 판결해드려요.',
    features: [
      { title: 'AI 판결문', body: '대화 캡처와 상황 설명을 올리면 AI가 분석해서 과실 비율과 판단 근거를 담은 판결문을 써 드려요.' },
      { title: '배심원 의견', body: '내 사건을 배심원석에 올려 다른 사용자들의 의견을 받아 볼 수 있어요.' },
      { title: '판결문 공유', body: '받은 판결문을 링크나 이미지로 친구에게 공유할 수 있어요.' },
    ],
    pricingTitle: '이용권 가격',
    listHeader: ['이용권', '결제금액'],
    amount: (amount) => `이용권 ${amount}개`,
    bonus: (bonus) => `+ ${bonus}개 보너스`,
    price: formatPrice,
    notes: [
      'AI 판결 1회에 이용권 1개를 사용해요.',
      '처음 가입하면 이용권 1개를 무료로 드려요.',
      '한 번 결제하는 상품이며, 자동으로 다시 결제되지 않아요.',
      '결제는 판매자(Merchant of Record)인 Paddle.com을 통해 진행돼요.',
      <>
        결제일로부터 14일 이내에는 사유와 관계없이 전액 환불받을 수 있어요.{' '}
        <Link to={paths.refund} className="underline underline-offset-2">환불 정책 보기</Link>
      </>,
    ],
    switchTo: paths.pricingEn,
  },
  en: {
    title: 'About Dalpan',
    headline: 'Am I being too sensitive?',
    description: 'Confused about a conflict in your relationship? Dalpan reviews the situation and the conversation, and delivers a verdict.',
    features: [
      { title: 'AI verdict', body: 'Upload chat screenshots and describe the situation. Our AI analyzes them and writes a verdict with the fault ratio and the reasoning behind it.' },
      { title: 'Jury opinions', body: 'Post your case to the jury board and get opinions from other users.' },
      { title: 'Share verdicts', body: 'Share your verdict with friends as a link or an image.' },
    ],
    pricingTitle: 'AI verdict packs',
    listHeader: ['Pack', 'Price'],
    amount: (amount) => `${amount} AI ${amount === 1 ? 'verdict' : 'verdicts'}`,
    bonus: (bonus) => `+ ${bonus} bonus`,
    price: (price) => `₩${price.toLocaleString('en-US')}`,
    notes: [
      'Prices are in Korean won (KRW).',
      'Each pack is a set of verdict passes. 1 pass = 1 AI verdict.',
      'New members get 1 free verdict pass when they sign up.',
      'Packs are a one-time purchase and are never charged automatically.',
      'Payments are processed by Paddle.com, our Merchant of Record.',
      <>
        Full refund for any reason within 14 days of payment.{' '}
        <Link to={paths.refundEn} className="underline underline-offset-2">See Refund Policy</Link>
      </>,
    ],
    switchTo: paths.pricing,
  },
}

function PricingPage({ lang = 'ko' }: { lang?: PolicyLang }) {
  const goBack = useGoBack(paths.login)
  const copy = COPY[lang]

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
        </section>

        <section aria-labelledby="pricing-list" className="mt-9">
          <h2 id="pricing-list" className="text-h3-medium">{copy.pricingTitle}</h2>

          {/* 목록 헤더와 상품 카드는 이용권 충전 화면과 같은 모양 */}
          <div className="text-l1-medium mt-3 flex h-13 items-center justify-between rounded-lg bg-white-100 pr-4.5 pl-4.25 text-[#343434]">
            <span>{copy.listHeader[0]}</span>
            <span>{copy.listHeader[1]}</span>
          </div>
          <div className="mt-3 rounded-lg bg-white-100 pt-4.75 pr-4.5 pb-5.75 pl-3">
            <ul className="flex flex-col gap-4.5">
              {PRODUCTS.map(({ amount, bonus, price }) => (
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
            {copy.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
      </main>
      <PolicyFooter lang={lang} switchTo={copy.switchTo} className="mt-auto px-6 pt-10 pb-9" />
    </div>
  )
}

export default PricingPage
