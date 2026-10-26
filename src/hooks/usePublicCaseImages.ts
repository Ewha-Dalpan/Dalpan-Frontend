import { useEffect, useRef, useState } from 'react'
import { getPublicCaseImage } from '../apis/caseApi'
import type { CaseImage } from '../types/case'
import type { PublicImageDraft } from '../utils/publishCase'

type Capture = PublicImageDraft & { src: string; hasPublicImage: boolean }

export function usePublicCaseImages(caseId: number, images: CaseImage[]) {
  const [captures, setCaptures] = useState<Capture[]>([])
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const urls = useRef(new Set<string>())
  const active = useRef(false)

  useEffect(() => {
    active.current = true
    const ownedUrls = urls.current
    return () => {
      active.current = false
      ownedUrls.forEach((url) => URL.revokeObjectURL(url))
      ownedUrls.clear()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const results = await Promise.allSettled([...images].sort((a, b) => a.sort_order - b.sort_order).map(async (image): Promise<Capture> => {
        const blob = await getPublicCaseImage(caseId, image.id)
        const src = URL.createObjectURL(blob)
        if (cancelled) URL.revokeObjectURL(src)
        else urls.current.add(src)
        return { id: image.id, blob, src, action: 'keep', hasPublicImage: image.has_public_image }
      }))
      if (cancelled) return
      if (results.some((result) => result.status === 'rejected')) setError(true)
      else {
        setError(false)
        setCaptures(results.map((result) => (result as PromiseFulfilledResult<Capture>).value))
      }
    }
    void load()
    return () => { cancelled = true }
  }, [caseId, images, attempt])

  const replace = (id: number, blob: Blob, action: 'upload' | 'reset') => {
    if (!active.current) return
    const src = URL.createObjectURL(blob)
    urls.current.add(src)
    setCaptures((previous) => previous.map((capture) => capture.id === id ? { ...capture, blob, src, action } : capture))
  }

  return { captures, error, replace, retry: () => { setError(false); setAttempt((value) => value + 1) }, ready: !error && images.length > 0 && captures.length === images.length }
}
