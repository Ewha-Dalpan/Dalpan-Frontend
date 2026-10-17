// 톨 API: 잔액, 이용 내역

import axiosInstance from './axiosInstance'
import type { Paginated } from '../types/common'
import type { CoinBalance, CoinLedger, CoinLedgerParams } from '../types/coin'

export const getCoinBalance = async () => {
  const { data } = await axiosInstance.get<CoinBalance>('/api/coins/balance/')
  return data
}

export const getCoinLedger = async (params: CoinLedgerParams = {}) => {
  const { data } = await axiosInstance.get<Paginated<CoinLedger>>('/api/coins/ledger/', { params })
  return data
}
