import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Case } from '../../types/case'
import { paths } from '../../routes/paths'
import Modal from './Modal'
import ResumeCaseModal from './ResumeCaseModal'

export default function PendingCaseModals({ item, onClose }: { item: Case; onClose: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'choose' | 'new' | 'resume'>('choose')
  if (step === 'resume') return <ResumeCaseModal caseId={item.id} onClose={onClose} />
  return <Modal open title={step === 'choose' ? '확인 중인 사건이 있어요' : '새 사건을 시작할까요?'}
    description={step === 'choose' ? `${new Date(item.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}에 접수한 사건을 이어서 확인할까요?` : '기존 사건은 내 사건 목록에서 다시 확인할 수 있어요.'}
    cancelText={step === 'choose' ? '새로 시작하기' : '계속 확인하기'} confirmText={step === 'choose' ? '이어서 하기' : '새로 시작하기'}
    onDismiss={onClose} onCancel={() => setStep(step === 'choose' ? 'new' : 'resume')}
    onConfirm={() => { if (step === 'choose') setStep('resume'); else { onClose(); navigate(paths.upload) } }} />
}
