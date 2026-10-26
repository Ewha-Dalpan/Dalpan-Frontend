import type { CoinLedger } from '../types/coin'

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric',
})

export function groupCoinLedger(items: CoinLedger[]) {
  const groups = new Map<string, CoinLedger[]>()
  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id)
  for (const item of uniqueItems) {
    const parts = dateFormat.formatToParts(new Date(item.created_at))
    const part = (type: string) => parts.find((value) => value.type === type)?.value
    const date = `${part('year')}. ${part('month')}. ${part('day')}`
    const group = groups.get(date) ?? []
    group.push(item)
    groups.set(date, group)
  }
  return [...groups].map(([date, entries]) => ({ date, entries }))
}

export function getCoinLedgerLabel(item: CoinLedger) {
  switch (item.tx_type) {
    case 'VERDICT_SPEND': return 'AI 판결 요청'
    case 'CHARGE': return `톨 ${Math.abs(item.amount)}개 충전`
    case 'SIGNUP_BONUS': return '가입 축하 톨 지급'
    default: return item.tx_type_label
  }
}
