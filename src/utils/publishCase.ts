export type PublicImageDraft = {
  id: number
  blob: Blob
  action: 'keep' | 'upload' | 'reset'
}

type PublicCaseApi = {
  upload: (caseId: number, imageId: number, image: Blob) => Promise<unknown>
  reset: (caseId: number, imageId: number) => Promise<unknown>
  publish: (caseId: number) => Promise<unknown>
}

export async function savePublicCase(caseId: number, images: PublicImageDraft[], api: PublicCaseApi) {
  if (!images.length) throw new Error('공개할 이미지를 확인해 주세요.')
  if (images.reduce((total, image) => total + image.blob.size, 0) > 20 * 1024 * 1024) {
    throw new Error('공개 이미지의 전체 용량은 20MiB 이하여야 해요.')
  }
  for (const image of images) {
    if (image.action !== 'upload') continue
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(image.blob.type)) {
      throw new Error('PNG, JPEG, WEBP 이미지만 저장할 수 있어요.')
    }
    if (image.blob.size > 5 * 1024 * 1024) throw new Error('공개 이미지는 한 장에 5MiB 이하여야 해요.')
  }
  for (const image of images) {
    if (image.action === 'upload') await api.upload(caseId, image.id, image.blob)
    if (image.action === 'reset') await api.reset(caseId, image.id)
  }
  return api.publish(caseId)
}
