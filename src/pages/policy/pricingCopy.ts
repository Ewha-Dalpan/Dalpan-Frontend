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
  disclaimer: string // 법적·사실 판단이 아니라는 안내 (Paddle 심사: AI가 사람을 판단하는 서비스로 보이면 안 됨)
  pricingTitle: string
  pricingSummary: string // 결제 대상은 AI 분석 이용권뿐, 배심원석은 무료
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
    description: '헷갈리는 관계 속 갈등, 내가 나눈 대화를 돌아보고 내 소통 방식에 대한 참고용 관점을 받아 보세요.',
    features: [
      { title: 'AI 대화 돌아보기', body: '내가 참여한 대화 캡처를 올리면 AI가 대화 흐름과 서로의 입장을 정리하고, 양쪽 입장을 비율로 나타낸 참고용 분석을 보여 드려요.' },
      { title: '배심원 의견 (무료)', body: '상대방 정보를 가린 대화를 배심원석에 올려 다른 사용자들의 의견을 무료로 받아 볼 수 있어요.' },
      { title: '결과 공유', body: '받은 분석 결과를 링크나 이미지로 친구에게 공유할 수 있어요.' },
    ],
    disclaimer: '달판의 AI 분석은 내 소통 방식을 돌아보기 위한 참고용 관점이며, 법적·사실 판단이나 특정인에 대한 평가가 아니에요. 대화를 올리기 전에 상대방의 이름과 프로필 사진은 가려 주세요.',
    pricingTitle: '이용권 가격',
    pricingSummary: '결제가 필요한 상품은 AI 대화 분석 이용권뿐이에요. 배심원석(사건 공개, 투표, 댓글)과 공유는 무료예요.',
    listHeader: ['이용권', '결제금액'],
    amount: (amount) => `이용권 ${amount}개`,
    bonus: (bonus) => `+ ${bonus}개 보너스`,
    price: formatPrice,
    notes: [
      'AI 대화 분석 1회에 이용권 1개를 사용해요.',
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
    description: 'Look back on a conversation that confused you, and get a reference perspective on your own communication style.',
    features: [
      { title: 'AI conversation review', body: 'Upload screenshots of a conversation you took part in. Our AI summarizes how the conversation unfolded and each side\'s point of view, and shows a reference analysis that expresses both perspectives as a ratio.' },
      { title: 'Jury opinions (free)', body: 'Post a conversation with the other person\'s information hidden to the jury board and get opinions from other users for free.' },
      { title: 'Share results', body: 'Share your review with friends as a link or an image.' },
    ],
    disclaimer: 'Dalpan\'s AI analysis is a reference perspective to help you reflect on your own communication. It is not a legal or factual determination, and not an assessment of any person. Please hide the other person\'s name and profile photo before uploading.',
    pricingTitle: 'AI conversation review packs',
    pricingSummary: 'The only paid product is AI conversation review packs. The jury board (posting, voting, comments) and sharing are free.',
    listHeader: ['Pack', 'Price'],
    amount: (amount) => `${amount} AI ${amount === 1 ? 'review' : 'reviews'}`,
    bonus: (bonus) => `+ ${bonus} bonus`,
    price: (price) => `₩${price.toLocaleString('en-US')}`,
    notes: [
      'Prices are in Korean won (KRW).',
      'Each pack is a set of review passes. 1 pass = 1 AI conversation review.',
      'New members get 1 free review pass when they sign up.',
      'Packs are a one-time purchase and are never charged automatically.',
      'Payments are processed by Paddle.com, our Merchant of Record.',
    ],
    refundNote: { text: 'Full refund for any reason within 14 days of payment.', linkLabel: 'See Refund Policy', to: paths.refundEn },
    start: 'Get started',
    switchTo: paths.pricing,
  },
}
