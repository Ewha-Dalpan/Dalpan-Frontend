// 톨 잔액, 이용 내역 API 타입

export type CoinBalance = {
  balance: number
}

export type CoinLedgerKind = 'all' | 'earn' | 'spend' // 전체 / 받은 내역 / 쓴 내역

export type CoinLedger = {
  id: number
  tx_type: string // 내역 종류 (코드)
  tx_type_label: string // 화면에 보여줄 이름
  amount: number
  balance_after: number // 이 내역 이후 잔액
  case: unknown // TODO: 구조 확인 필요 (관련 사건)
  created_at: string
}

export type CoinLedgerParams = {
  page?: number
  page_size?: number // 기본 20, 최대 100
  date_from?: string // YYYY-MM-DD
  date_to?: string // YYYY-MM-DD
  kind?: CoinLedgerKind
}
