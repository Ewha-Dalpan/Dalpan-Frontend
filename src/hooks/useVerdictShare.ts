// 판결문 공유하기 (판결문 전체 화면, 마이 > 내 사건 상세에서 같이 씀)
// 1. openShare: 공유 모달을 여는 동안 공유 링크 · 캡처 이미지를 미리 만들어 둠
// 2. handleShare: 모달에서 고른 곳으로 공유
// captureRef는 화면 밖에 숨겨 둔 판결문 이미지(VerdictBoard variant="image")에 붙여서 사용

import { useRef, useState } from 'react'
import { createShareLink } from '../apis/verdictApi'
import { paths } from '../routes/paths'
import { loadKakao } from '../utils/kakao'
import { captureImage, shareTo } from '../utils/share'
import type { ShareTarget } from '../utils/share'
import { useToast } from './useToast'

export const useVerdictShare = (caseId: number | undefined, title: string | null | undefined) => {
  const { toast, showToast, hideToast } = useToast()
  const [isShareOpen, setIsShareOpen] = useState(false) // 공유하기 모달
  const captureRef = useRef<HTMLDivElement>(null) // 저장할 때 캡처하는 판결문 이미지
  const shareImage = useRef<Promise<File | null> | null>(null) // 캡처 이미지
  const shareUrl = useRef<Promise<string | null> | null>(null) // 공유 링크 (받은 사람은 '판결문 공유 유입' 화면으로 들어옴)

  const openShare = () => {
    if (caseId === undefined) return
    void loadKakao() // 카카오톡 버튼을 누르기 전에 SDK를 미리 불러둠
    shareImage.current ??= captureImage(captureRef.current, '달판-판결문.png').then((image) => {
      if (!image) shareImage.current = null
      return image
    })
    // 공유 링크 만들기 → 지금 사이트 주소 + /shared/{토큰} (로컬 · 배포 어디서든 그 사이트로 열리게)
    shareUrl.current ??= createShareLink(caseId)
      .then(({ token }) => `${window.location.origin}${paths.sharedVerdict(token)}`)
      .catch(() => {
        shareUrl.current = null // 실패하면 다음에 다시 만들 수 있게
        return null
      })
    setIsShareOpen(true)
  }

  // 모달을 먼저 닫고 공유
  const handleShare = async (target: ShareTarget) => {
    setIsShareOpen(false)
    const url = await shareUrl.current
    if (!url) {
      showToast('공유 링크를 만들지 못했어요. 잠시 후 다시 시도해 주세요.')
      return
    }
    const message = await shareTo(target, {
      url,
      text: `달판 AI 판결문 | ${title ?? ''}`,
      image: shareImage.current,
    })
    if (message) showToast(message)
  }

  return {
    captureRef,
    openShare,
    // <ShareSheet {...shareSheet} />
    shareSheet: { open: isShareOpen, onClose: () => setIsShareOpen(false), onSelect: handleShare },
    toast,
    showToast,
    hideToast,
  }
}
