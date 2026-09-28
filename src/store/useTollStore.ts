// 톨 전역 상태: 보유 톨 개수 등을 관리

import { create } from 'zustand'

type TollState = Record<string, never>

export const useTollStore = create<TollState>(() => ({}))
