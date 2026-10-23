import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const calls = []
let count = 0
let fail = false
globalThis.__featuredCasesTestGet = async ({ page, sort }) => {
  calls.push({ page, sort })
  if (fail) throw new Error('조회 실패')
  return { count, next: page * 20 < count ? 'next' : null, previous: null,
    results: Array.from({ length: Math.max(0, Math.min(20, count - (page - 1) * 20)) }, (_, i) => ({ case_id: (page - 1) * 20 + i + 1 })) }
}
const mock = `export const getJuryCases = globalThis.__featuredCasesTestGet`
const mockUrl = `data:text/javascript;base64,${Buffer.from(mock).toString('base64')}`
const source = readFileSync(new URL('../src/apis/featuredCasesApi.ts', import.meta.url), 'utf8').replace("'./juryApi'", JSON.stringify(mockUrl))
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { getRandomCases, getPopularCases } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)

test('공개 사건이 없으면 예시 카드 없이 빈 목록을 반환한다', async () => {
  count = 0
  assert.deepEqual(await getRandomCases(), [])
})

test('3건 미만이면 실제 사건만 중복 없이 반환한다', async () => {
  count = 2
  assert.deepEqual((await getRandomCases()).map(x => x.case_id).sort(), [1, 2])
})

test('첫 페이지 밖의 사건도 무작위 후보에 포함하고 필요한 페이지만 조회한다', async () => {
  count = 45
  calls.length = 0
  const original = Math.random
  Math.random = () => 0.9999
  try {
    const cases = await getRandomCases()
    assert.deepEqual(cases.map(x => x.case_id), [43, 44, 45])
    assert.deepEqual(calls, [{ page: 1, sort: 'latest' }, { page: 3, sort: 'latest' }])
  } finally { Math.random = original }
})

test('후보가 겹쳐도 서로 다른 3개를 반환한다', async () => {
  count = 45
  const original = Math.random
  Math.random = () => 0
  try { assert.equal(new Set((await getRandomCases()).map(x => x.case_id)).size, 3) }
  finally { Math.random = original }
})

test('조회 실패를 빈 목록으로 숨기지 않는다', async () => {
  fail = true
  await assert.rejects(getRandomCases, /조회 실패/)
})

 test('홈은 서버 인기순을 유지한 상위 3개만 반환한다', async () => {
  fail = false
  count = 45
  calls.length = 0
  assert.deepEqual((await getPopularCases()).map(x => x.case_id), [1, 2, 3])
  assert.deepEqual(calls, [{page: 1, sort: 'popular'}])
})
