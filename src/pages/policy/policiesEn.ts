// 영문 이용약관 · 환불 정책 · 개인정보처리방침 (한국어 본문과 내용을 같게 맞춤)
// 한국어 본문을 고치면 여기도 같이 고쳐야 함

import type { TermsSection } from '../onboarding/terms'
import { OPERATOR, POLICY_EFFECTIVE_DATE_EN } from './operator'

export const TERMS_EN: TermsSection[] = [
  {
    title: 'Article 1 (Purpose)',
    body: `These Terms set out the rights, obligations and responsibilities between ${OPERATOR.serviceEn} (operated by ${OPERATOR.name}, the "Operator") and its members regarding the use of the AI judgment service (AI judgments based on uploaded chat screenshots, jury opinion requests, reply suggestions, sharing, etc., the "Service").`,
  },
  {
    title: 'Article 2 (Operator Information)',
    body: `1. Service: ${OPERATOR.serviceEn} 2. Operator: ${OPERATOR.name} (sole proprietor) 3. Contact: ${OPERATOR.email}`,
  },
  {
    title: 'Article 3 (Membership)',
    body: '1. You can sign up with an ID and password or with social login (e.g., Kakao). 2. Persons under the age of 14 may not sign up, and age is confirmed at sign-up.',
  },
  {
    title: 'Article 4 (Paid Services and Payment)',
    body: "1. The Operator sells credits (\"Tol\") used to request AI judgments. Prices for each product are shown on the pricing page and the credit purchase screen. 2. Credits are one-time purchases and are never charged automatically or on a recurring basis. 3. Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle handles payments, taxes, payment-related customer service inquiries and refunds. 4. Payments are also subject to Paddle's Buyer Terms in addition to these Terms.",
  },
  {
    title: 'Article 5 (Use and Refund of Credits)',
    body: '1. Credits can be purchased, or granted free of charge for reasons set by the Operator, such as signing up. 2. One credit is deducted for each AI judgment request. 3. Purchased credits are fully refunded for any reason if requested within 14 days of payment. See the Refund Policy for details. 4. Free credits involve no payment and are therefore not refundable. 5. Credits cannot be exchanged for cash or transferred to other members.',
  },
  {
    title: 'Article 6 (Member Obligations and Prohibited Conduct)',
    body: "Members may only upload conversations in which they are a participant or for which they have the participants' consent, and must not post content that defames or disparages others. Members must also not: 1. disclose another person's personal information, such as their name, contact details, face or account, without consent (doxxing); 2. harass or threaten any person, or promote hatred or discrimination; 3. post content that violates the law, such as sexually explicit or violent content; 4. disrupt the Service, for example by using it through automated means or abusing the payment or refund process.",
  },
  {
    title: 'Article 7 (Content Moderation)',
    body: '1. The Operator may review content that violates Article 6 or has been reported, and may remove it or make it private. Depending on the severity of the violation, the Operator may also restrict the member\'s use of the Service. 2. When publishing a case to the jury board, members can hide personal information such as names with the mosaic tool, and must make sure no personal information is exposed before publishing. 3. Members can report problematic cases and comments on the jury board, and the Operator reviews reports and takes appropriate action.',
  },
  {
    title: 'Article 8 (Intellectual Property)',
    body: '1. Rights to content uploaded by members, such as chat screenshots, remain with the member (or the original rights holder). The Operator uses such content only to the extent necessary to provide the Service (AI judgments, jury board publishing, sharing, etc.). 2. Members may freely use and share the AI judgments and suggested replies they receive for personal purposes. 3. Rights to the design, characters, logo and software of the Service belong to the Operator, and members may not copy or commercially use them without the Operator\'s permission.',
  },
  {
    title: 'Article 9 (Disclaimer of AI Judgments)',
    body: 'AI judgments are analyses based on uploaded conversations provided for reference only, and do not replace legal judgment or professional advice. The Operator does not guarantee their accuracy and is not liable for any damage arising from reliance on them.',
  },
  {
    title: 'Article 10 (Changes and Suspension of the Service)',
    body: '1. The Operator may change or temporarily suspend the Service when necessary, such as for improvements or system maintenance, and will announce important changes in the Service in advance. 2. If the Service is discontinued, unused purchased credits will be refunded.',
  },
  {
    title: 'Article 11 (Termination)',
    body: 'Members may delete their account in the Service at any time. The Operator may restrict use or terminate the agreement if a member violates Article 6.',
  },
  {
    title: 'Article 12 (Changes to These Terms)',
    body: 'The Operator may change these Terms to the extent permitted by applicable law. Changes will be announced in the Service at least 7 days before they take effect, and members will be asked to agree again.',
  },
  {
    title: 'Article 13 (Governing Law and Jurisdiction)',
    body: 'These Terms are governed by the laws of the Republic of Korea. Any dispute related to the use of the Service will be resolved by the competent court under the Korean Civil Procedure Act.',
  },
  {
    title: 'Supplementary Provision',
    body: `These Terms take effect on ${POLICY_EFFECTIVE_DATE_EN}. These Terms are provided in Korean and English; if there is any inconsistency, the Korean version prevails.`,
  },
]

export const REFUND_POLICY_EN: TermsSection[] = [
  {
    title: '1. Refund Period',
    body: 'Purchased credits ("Tol") are fully refunded for any reason, whether or not the credits have been used, if you request a refund within 14 days of payment.',
  },
  {
    title: '2. How to Request a Refund',
    body: `- Look up your order at paddle.net with the email address you used for payment and request a refund from Paddle directly, or - email ${OPERATOR.email} with the email address you used for payment, the payment date and your Paddle order number (shown in the receipt email).`,
  },
  {
    title: '3. Refund Processing',
    body: 'Orders are processed by Paddle.com as the Merchant of Record, so refunds are issued by Paddle.com to the original payment method. The time it takes for the refund to arrive depends on your payment provider (e.g., card issuer).',
  },
  {
    title: '4. Credits After a Refund',
    body: 'Once a refund is completed, the number of credits added by that payment is removed from the remaining credits in your account. Credits are deducted from your balance regardless of whether they were purchased or free, and if you have already used them and your balance is insufficient, only the remaining balance is removed.',
  },
  {
    title: '5. Free Credits',
    body: 'Credits granted free of charge, such as the sign-up bonus or jury activity rewards, involve no payment and are therefore not refundable.',
  },
  {
    title: '6. Returns for Service Errors',
    body: 'If a judgment request fails due to a system error, the credit used is returned automatically without a refund request.',
  },
  {
    title: '7. After 14 Days',
    body: "Refund requests made more than 14 days after payment are reviewed case by case under Paddle's Buyer Terms and refund policy. Where applicable law grants more favorable rights, that law prevails.",
  },
  {
    title: '8. Refund Restrictions',
    body: "If fraudulent use such as fraud or refund abuse is identified, a refund may be refused under Paddle's refund policy, and use of the Service may be restricted under the Terms of Service.",
  },
  {
    title: 'Effective Date',
    body: `This policy takes effect on ${POLICY_EFFECTIVE_DATE_EN}.`,
  },
]

export const PRIVACY_POLICY_EN: TermsSection[] = [
  {
    title: '1. Personal Information We Process',
    body: '- Required: ID, password (stored encrypted) or social account identifier (e.g., Kakao), nickname - Required: chat screenshot images uploaded while using the Service and the conversations they contain - For payments: payment email and payment history (payment method details such as card numbers are processed directly by Paddle.com; the Operator never receives or stores them) - Collected automatically: device information, access logs, service usage records',
  },
  {
    title: '2. Purposes of Processing',
    body: '- Sign-up, identity verification and preventing misuse of the Service - Providing AI judgments (situation analysis, fault ratio, etc.) - Managing credit purchases and usage, and processing payments and refunds - Operating community features such as jury opinion requests - Improving the Service and analyzing errors',
  },
  {
    title: '3. Retention Period',
    body: 'Personal information is deleted without delay when a member deletes their account. However, where applicable laws (such as the Korean E-Commerce Act) require a specific retention period, it is kept for that period (e.g., payment records for 5 years).',
  },
  {
    title: '4. Third-Party Provision and Processors',
    body: 'We do not provide members\' personal information to third parties in principle (except where required by law). To provide the Service, we share only the minimum necessary information with the following companies: - Paddle.com: credit payments, tax handling and refunds (processes payment information directly as the Merchant of Record) - Kakao: social login - Railway: server operation and data storage - Liner AI: analysis of uploaded conversations and AI judgment processing',
  },
  {
    title: '5. Your Rights',
    body: `Members may at any time request access to, correction or deletion of their personal information, or the suspension of its processing. You can delete your account in Account Settings or send a request to ${OPERATOR.email}.`,
  },
  {
    title: '6. Deletion Procedure and Method',
    body: 'Personal information whose retention period has ended or whose purpose has been fulfilled is deleted without delay, and electronic files are deleted in a way that cannot be recovered.',
  },
  {
    title: '7. Privacy Officer',
    body: `- Name: ${OPERATOR.name} - Email: ${OPERATOR.email}`,
  },
  {
    title: 'Effective Date',
    body: `This policy takes effect on ${POLICY_EFFECTIVE_DATE_EN}.`,
  },
]
