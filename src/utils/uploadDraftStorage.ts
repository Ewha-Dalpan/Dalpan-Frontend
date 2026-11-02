// 접수 대기 중인 대화 캡처를 PayApp 결제창에 다녀오는 동안 브라우저(IndexedDB)에 잠시 보관
// 결제창으로 나가면 메모리가 지워지고, 사진 파일은 localStorage에 넣을 수 없어서 IndexedDB를 씀
// 접수하거나 로그아웃하면 지우고, 그러지 않아도 24시간이 지나면 지움
// 저장소를 못 쓰는 환경(사생활 보호 모드 등)이면 조용히 넘어감 → 결제 후 사진을 다시 올리면 됨

import type { Photo } from '../components/PhotoUploadBox'
import type { CaseRelation } from '../types/case'

const DB_NAME = 'dalpan-upload-draft'
const STORE_NAME = 'drafts'
const DRAFT_KEY = 'current'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

type StoredDraft = {
  orderId: string // 이 주문의 결제 결과 화면에서만 꺼내 씀 (다른 충전에 예전 사진이 접수되지 않게)
  relation: CaseRelation
  photos: Pick<Photo, 'id' | 'file'>[]
  savedAt: number
}

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

// 트랜잭션 하나를 열어 요청을 보내고 결과를 돌려줌
const runRequest = async <T>(mode: IDBTransactionMode, makeRequest: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDb()
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = makeRequest(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } finally {
    db.close()
  }
}

export const saveStoredDraft = async (draft: Omit<StoredDraft, 'savedAt'>) => {
  try {
    const stored: StoredDraft = {
      orderId: draft.orderId,
      relation: draft.relation,
      photos: draft.photos.map(({ id, file }) => ({ id, file })),
      savedAt: Date.now(),
    }
    await runRequest('readwrite', (store) => store.put(stored, DRAFT_KEY))
  } catch {
    // 보관하지 못해도 결제는 그대로 진행
  }
}

export const deleteStoredDraft = async () => {
  try {
    await runRequest('readwrite', (store) => store.delete(DRAFT_KEY))
  } catch {
    // 저장소를 못 쓰는 환경이면 지울 것도 없음
  }
}

const readValidDraft = async () => {
  const stored = await runRequest<StoredDraft | undefined>('readonly', (store) => store.get(DRAFT_KEY))
  if (stored && Date.now() - stored.savedAt > MAX_AGE_MS) {
    await deleteStoredDraft()
    return null
  }
  return stored ?? null
}

// 이 주문을 결제하러 나가면서 보관한 사진 꺼내기
export const loadStoredDraft = async (orderId: string) => {
  try {
    const stored = await readValidDraft()
    return stored?.orderId === orderId ? stored : null
  } catch {
    return null
  }
}

// 앱을 열 때 기한이 지난 사진을 지움
export const purgeExpiredDraft = async () => {
  try {
    await readValidDraft()
  } catch {
    // 저장소를 못 쓰는 환경이면 지울 것도 없음
  }
}
