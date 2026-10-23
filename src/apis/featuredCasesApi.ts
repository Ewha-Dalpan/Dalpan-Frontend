import { getJuryCases } from './juryApi'

export async function getFeaturedCases() {
  const first = await getJuryCases({ page: 1, sort: 'latest' })
  const indices = new Set<number>()
  for (let index = Math.max(0, first.count - 3); index < first.count; index++) {
    const candidate = Math.floor(Math.random() * (index + 1))
    indices.add(indices.has(candidate) ? index : candidate)
  }
  const selected = [...indices]
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[selected[i], selected[j]] = [selected[j], selected[i]]
  }
  const pageNumbers = [...new Set(selected.map((index) => Math.floor(index / 20) + 1))]
  const pages = new Map(await Promise.all(pageNumbers.map(async (page) =>
    [page, page === 1 ? first : await getJuryCases({ page, sort: 'latest' })] as const)))
  const cases = selected.flatMap((index) => {
    const item = pages.get(Math.floor(index / 20) + 1)?.results[index % 20]
    return item ? [item] : []
  })
  return [...new Map(cases.map((item) => [item.case_id, item])).values()]
}
