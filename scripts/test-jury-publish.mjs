import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/publishCase.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } })
const { savePublicCase } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const image = (id, action = 'keep', blob = new Blob(['image'], { type: 'image/png' })) => ({ id, action, blob })
function mockApi() {
  const calls = []
  return { calls, api: {
    upload: async (caseId, id, blob) => { calls.push(['upload', caseId, id]); assert.ok(blob instanceof Blob) },
    reset: async (caseId, id) => { calls.push(['reset', caseId, id]) },
    publish: async (caseId) => { calls.push(['publish', caseId]); return { is_public: true } },
  } }
}

test('edits and resets finish before publishing the correct case; untouched images stay untouched', async () => {
  const { calls, api } = mockApi()
  await savePublicCase(42, [image(1), image(2, 'upload'), image(3, 'reset')], api)
  assert.deepEqual(calls, [['upload', 42, 2], ['reset', 42, 3], ['publish', 42]])
})

test('upload failure blocks publishing and retains drafts for retry', async () => {
  const { calls, api } = mockApi()
  const drafts = [image(1, 'upload'), image(2, 'upload')]
  api.upload = async (_caseId, id) => { calls.push(['upload', id]); if (id === 2) throw new Error('upload failed') }
  await assert.rejects(savePublicCase(42, drafts, api), /upload failed/)
  assert.deepEqual(calls, [['upload', 1], ['upload', 2]])
  const retry = mockApi()
  await savePublicCase(42, drafts, retry.api)
  assert.deepEqual(retry.calls.at(-1), ['publish', 42])
})

test('reset failure blocks publishing', async () => {
  const { calls, api } = mockApi()
  api.reset = async () => { throw new Error('reset failed') }
  await assert.rejects(savePublicCase(42, [image(1, 'reset')], api), /reset failed/)
  assert.deepEqual(calls, [])
})

test('validation completes before uploading any files', async () => {
  const { calls, api } = mockApi()
  await assert.rejects(savePublicCase(42, [image(1, 'upload'), image(2, 'upload', new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: 'image/png' }))], api), /5MiB/)
  await assert.rejects(savePublicCase(42, [image(1, 'upload', new Blob(['bad'], { type: 'text/plain' }))], api), /PNG/)
  await assert.rejects(savePublicCase(42, [], api), /이미지/)
  await assert.rejects(savePublicCase(42, [image(1, 'keep', new Blob([new Uint8Array(20 * 1024 * 1024 + 1)]))], api), /20MiB/)
  assert.deepEqual(calls, [])
})

test('publish failure is propagated', async () => {
  const { api } = mockApi()
  api.publish = async () => { throw new Error('not judged') }
  await assert.rejects(savePublicCase(42, [image(1)], api), /not judged/)
})
