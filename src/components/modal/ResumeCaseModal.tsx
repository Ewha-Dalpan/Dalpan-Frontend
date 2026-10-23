import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCase, getCasePayment, submitCase } from '../../apis/caseApi'
import { useCaseStore } from '../../store/useCaseStore'
import { paths } from '../../routes/paths'
import { getApiErrorMessage } from '../../utils/apiError'
import Modal from './Modal'

export default function ResumeCaseModal({ caseId, onClose }: { caseId: number; onClose: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const locked = useRef(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const query = useQuery({
    queryKey: ['caseResume', caseId],
    queryFn: async () => {
      const [item, payment] = await Promise.all([getCase(caseId), getCasePayment(caseId)])
      return { item, payment }
    },
    staleTime: 0,
  })
  const data = query.data
  const confirm = async () => {
    if (locked.current || query.isFetching) return
    if (query.isError) { void query.refetch(); return }
    if (!data) return
    if (data.item.status === 'JUDGED') { onClose(); navigate(paths.myCaseDetail(caseId)); return }
    if (!data.payment.can_submit) { onClose(); navigate(paths.tollCharge); return }
    if (data.payment.cost > 0 && data.item.status !== 'WRITING') {
      setMessage('현재 상태에서는 분석을 재접수할 수 없어요. 사건 상태를 다시 확인해 주세요.')
      void query.refetch()
      return
    }
    locked.current = true
    setBusy(true)
    setMessage('')
    try {
      const latest = await getCasePayment(caseId)
      if (latest.cost !== data.payment.cost || !latest.can_submit) {
        await query.refetch()
        setMessage('접수 비용 또는 잔액이 변경됐어요. 확인 후 다시 눌러 주세요.')
        return
      }
      const request = await submitCase(caseId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['myCases'] }),
        queryClient.invalidateQueries({ queryKey: ['coinBalance'] }),
        queryClient.invalidateQueries({ queryKey: ['me'] }),
      ])
      if (request.case_id !== caseId) throw new Error('사건 정보가 일치하지 않아요.')
      if (request.status === 'FAILED' || request.status === 'CANCELED') {
        setMessage(request.error_message || '종료된 요청이에요. 다시 확인해 주세요.')
        void query.refetch()
        return
      }
      if (request.status === 'DONE') {
        onClose()
        navigate(paths.myCaseDetail(caseId))
        return
      }
      const store = useCaseStore.getState()
      store.receiveCase({ caseId, requestId: request.id })
      if (request.stage === 'JUDGMENT') store.startJudging()
      queryClient.setQueryData(['verdictRequest', request.id], request)
      queryClient.setQueryData(['case', caseId], data.item)
      onClose()
      navigate(request.status === 'AWAITING_CONFIRMATION' ? paths.confirm : request.stage === 'JUDGMENT' ? paths.judging : paths.received)
    } catch (error) {
      setMessage(getApiErrorMessage(error))
      void query.refetch()
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  return <Modal open title={busy ? '사건을 연결하고 있어요' : '사건을 이어서 진행할까요?'}
    description={message || (query.isPending ? '사건 상태와 접수 비용을 확인하고 있어요.' : query.isError ? getApiErrorMessage(query.error) : data?.item.status === 'JUDGED' ? '판결이 완료됐어요. 판결문을 확인해 주세요.' : data ? `보유 ${data.payment.balance}톨 · 접수 비용 ${data.payment.cost}톨. ${data.payment.cost === 0 ? '기존 요청을 이어서 확인합니다.' : '새 분석 접수 시 톨이 차감됩니다.'}` : '')}
    cancelText="취소" confirmText={busy ? '처리 중…' : query.isError ? '다시 시도' : data?.item.status === 'JUDGED' ? '판결문 보기' : data && !data.payment.can_submit ? '톨 충전하기' : '이어서 하기'}
    onCancel={() => { if (!locked.current) onClose() }} onConfirm={() => void confirm()} />
}
