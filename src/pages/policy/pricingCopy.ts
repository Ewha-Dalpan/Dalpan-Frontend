// 서비스 안내 · 가격 페이지 문구와 상품 (화면과 빌드 때 만드는 정적 HTML에서 같이 씀)
// JSX · 이미지를 넣지 않음 (vite.config.ts에서 불러오기 때문)

import { paths } from '../../routes/paths'
import { formatPrice } from '../payment/coinProduct'
import type { PolicyLang } from './operator'

// 상품 API가 아직 화면설계서와 달라서 화면설계서 가격을 적어둠 (백엔드 상품이 맞춰지면 API로 교체)
export const PRICING_PRODUCTS = [
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
  notes: string[]
  refundNote: { text: string; linkLabel: string; to: string } // 마지막 줄: 환불 안내 + 환불 정책 링크
  start: string // 시작하기 버튼
  switchTo: string
}

export const PRICING_COPY: Record<PolicyLang, PricingCopy> = {
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
    ],
    refundNote: { text: '결제일로부터 14일 이내에는 사유와 관계없이 전액 환불받을 수 있어요.', linkLabel: '환불 정책 보기', to: paths.refund },
    start: '달판 시작하기',
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
    ],
    refundNote: { text: 'Full refund for any reason within 14 days of payment.', linkLabel: 'See Refund Policy', to: paths.refundEn },
    start: 'Get started',
    switchTo: paths.pricing,
  },
}
