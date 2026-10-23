import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { unpublishVerdict } from '../apis/verdictApi'
import type { Verdict } from '../types/verdict'
import { paths } from '../routes/paths'
import { getApiErrorMessage } from '../utils/apiError'
import Button from './Button'
import Modal from './modal/Modal'

type Props = { caseId: number; isPublic: boolean }

export default function CasePublicationActions({ caseId, isPublic }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)

  const handleUnpublish = async () => {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    setError('')
    try {
      await unpublishVerdict(caseId)
      queryClient.setQueryData<Verdict>(['verdict', caseId], (previous) => previous ? { ...previous, is_public: false } : previous)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['verdict', caseId] }),
        queryClient.invalidateQueries({ queryKey: ['myCases'] }),
        queryClient.invalidateQueries({ queryKey: ['juryCases'] }),
        queryClient.invalidateQueries({ queryKey: ['juryPublication', caseId] }),
      ])
      setOpen(false)
    } catch (failure) {
      setError(getApiErrorMessage(failure))
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="white" fullWidth disabled={busy} onClick={() => navigate(paths.juryRequest(caseId))}>
        {isPublic ? '공개 이미지 수정하기' : '배심원에게도 물어보기'}
      </Button>
      {isPublic && <Button variant="primary" fullWidth disabled={busy} onClick={() => { setError(''); setOpen(true) }}>올린 사건 내리기</Button>}
      <Modal open={open} title="올린 사건을 내릴까요?" description={<>{error || '배심원석에서 비공개로 바뀌며 사건과 판결문은 유지돼요. 기존 공유 링크는 계속 사용할 수 있어요.'}</>} cancelText="취소" confirmText={busy ? '내리는 중…' : '내리기'} onCancel={() => { if (!lock.current) setOpen(false) }} onConfirm={() => void handleUnpublish()} />
    </div>
  )
}
