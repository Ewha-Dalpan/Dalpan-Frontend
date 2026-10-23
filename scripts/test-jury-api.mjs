import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const calls = []
globalThis.__juryApiTestCalls = calls
const mock = `export default Object.fromEntries(['get','post','delete'].map(method => [method, async (...args) => { globalThis.__juryApiTestCalls.push({ method, args }); return { data: { ok: true } } }]))`
const mockUrl = `data:text/javascript;base64,${Buffer.from(mock).toString('base64')}`
const source = readFileSync(new URL('../src/apis/juryApi.ts', import.meta.url), 'utf8')
  .replace("'./axiosInstance'", JSON.stringify(mockUrl))
  .replaceAll('import.meta.env.VITE_API_BASE_URL', "'https://example.com/'")
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const api = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)

test('내 배심 활동은 투표한 사건만 페이지별로 조회한다', async () => {
  const params = { page: 2, type: 'votes' }
  await api.getMyJuryActivities(params)
  assert.deepEqual(calls.pop(), { method: 'get', args: ['/api/jury/me/activities/', { params }] })
})

test('목록 필터와 페이지를 전달한다', async () => {
  const params = { page: 2, relation: '친구', sort: 'popular' }
  await api.getJuryCases(params)
  assert.deepEqual(calls.pop(), { method: 'get', args: ['/api/jury/cases/', { params }] })
})

test('선택한 사건 ID로 상세를 조회한다', async () => {
  await api.getJuryCase(42)
  assert.deepEqual(calls.pop(), { method: 'get', args: ['/api/jury/cases/42/'] })
})

test('사연자 비율로 투표하고 댓글은 해당 사건에 작성·삭제한다', async () => {
  await api.voteJuryCase(42, { fault_ratio: 20 })
  assert.deepEqual(calls.pop(), { method: 'post', args: ['/api/jury/cases/42/votes/', { fault_ratio: 20 }] })
  await api.createJuryComment(42, '첫 줄\n둘째 줄')
  assert.deepEqual(calls.pop(), { method: 'post', args: ['/api/jury/cases/42/comments/', { content: '첫 줄\n둘째 줄' }] })
  await api.deleteJuryComment(42, 7)
  assert.deepEqual(calls.pop(), { method: 'delete', args: ['/api/jury/cases/42/comments/7/'] })
})

test('공개 이미지 주소에 사건 ID와 이미지 ID를 포함한다', () => {
  assert.equal(api.getJuryImageUrl(42, 7), 'https://example.com/api/jury/cases/42/images/7/')
})

test('사건 신고는 사건 경로에 사유와 내용을 전송한다', async () => {
  const body = { reason: 'OTHER', detail: '신고 사유 상세' }
  await api.reportJuryCase(42, body)
  assert.deepEqual(calls.pop(), { method: 'post', args: ['/api/jury/cases/42/reports/', body] })
})

test('댓글 신고는 사건 ID와 댓글 ID를 함께 지정한다', async () => {
  const body = { reason: 'PRIVACY', detail: '' }
  await api.reportJuryComment(42, 7, body)
  assert.deepEqual(calls.pop(), { method: 'post', args: ['/api/jury/cases/42/comments/7/reports/', body] })
})
