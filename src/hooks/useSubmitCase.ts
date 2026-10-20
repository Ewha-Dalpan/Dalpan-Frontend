// 사건 접수 공통 처리: 관계 + 대화 캡처 업로드 → 1톨 차감 후 AI 분석 시작 → 사건접수 로딩으로
// 업로드 화면 / 결제 완료 '보유톨을 활용해 접수하기' 두 곳에서 같이 사용

import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createCase } from '../apis/caseApi'
import { paths } from '../routes/paths'
import { useCaseStore } from '../store/useCaseStore'
import { useUploadDraftStore, type UploadDraft } from '../store/useUploadDraftStore'
import { getApiErrorMessage } from '../utils/apiError'

export const useSubmitCase = ({ onError }: { onError: (message: string) => void }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const receiveCase = useCaseStore((state) => state.receiveCase)
  const clearDraft = useUploadDraftStore((state) => state.clearDraft)

  const submission = useMutation({
    mutationFn: ({ relation, photos }: UploadDraft) => createCase({ relation, images: photos.map((photo) => photo.file) }),
    onSuccess: ({ case_id, verdict_request }) => {
      // 톨이 줄었으니 보유 톨, 내 정보를 다시 불러오게 함
      void queryClient.invalidateQueries({ queryKey: ['coinBalance'] })
      void queryClient.invalidateQueries({ queryKey: ['me'] })
      // 접수 로딩, 상황 확인에서 진행 상태를 조회할 수 있게 사건 ID 저장
      receiveCase({ caseId: case_id, requestId: verdict_request.id })
      clearDraft()
      navigate(paths.received)
    },
    onError: (error) => onError(getApiErrorMessage(error)),
  })

  // 빠르게 두 번 눌러서 2톨이 빠지지 않게 잠금 (화면이 다시 그려지기 전에도 바로 막힘)
  const isSubmitting = useRef(false)
  const submit = (draft: UploadDraft) => {
    if (isSubmitting.current) return
    isSubmitting.current = true
    // 실패하면 다시 접수할 수 있게 잠금 해제 (성공하면 화면을 떠나서 그대로 둠)
    submission.mutate(draft, { onError: () => (isSubmitting.current = false) })
  }

  return { submit, isPending: submission.isPending }
}
