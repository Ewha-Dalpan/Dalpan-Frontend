import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type JurySort = '최신순' | '인기순'

type JurySortState = {
  sort: JurySort
  setSort: (sort: JurySort) => void
}

export const useJurySortStore = create<JurySortState>()(
  persist(
    (set) => ({
      sort: '최신순',
      setSort: (sort) => set({ sort }),
    }),
    { name: 'dalpan-jury-sort' },
  ),
)
