// 보유 톨 (업로드 접수 모달 / 톨 충전 / 결제 완료에서 같이 사용)

import { useQuery } from '@tanstack/react-query'
import { getCoinBalance } from '../apis/coinApi'

// 사건 1건 접수에 드는 톨
export const TOLL_PER_CASE = 1

export const useCoinBalance = () =>
  useQuery({ queryKey: ['coinBalance'], queryFn: getCoinBalance, select: (data) => data.balance })
