// 확인 중인 사건이 있을 때 AI 재판을 새로 시작하려 하면 뜨는 모달 2개
// 1차: 확인 중인 사건이 있어요 (새로 시작하기 → 2차 / 이어서 하기 → 상황확인)
// 2차: 새로 시작하면 현재 사건을 이어갈 수 없어요 (계속 확인하기 → 상황확인 / 새로 시작하기 → 업로드)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import { useCaseStore } from '../store/useCaseStore'
import Modal from './Modal'

// 예: 9월 17일 오후 9:12
const receivedAtFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

type PendingCaseModalsProps = {
  open: boolean
  onClose: () => void
}

function PendingCaseModals({ open, onClose }: PendingCaseModalsProps) {
  const navigate = useNavigate()
  const pendingCase = useCaseStore((state) => state.pendingCase)
  const clearPendingCase = useCaseStore((state) => state.clearPendingCase)
  const [isRestartStep, setIsRestartStep] = useState(false) // 2차 모달 단계인지

  const close = () => {
    setIsRestartStep(false)
    onClose()
  }

  const goTo = (path: string) => {
    close()
    navigate(path)
  }

  return (
    <>
      <Modal
        open={open && !isRestartStep}
        title="확인 중인 사건이 있어요"
        description={
          <>
            {pendingCase && (
              <span className="font-medium text-keycolor-100">
                [{receivedAtFormat.format(pendingCase.receivedAt)}]
              </span>
            )}
            에 접수한 사건의
            <br />
            상황 확인을 이어서 진행할까요?
          </>
        }
        cancelText="새로 시작하기"
        confirmText="이어서 하기"
        onCancel={() => setIsRestartStep(true)}
        onDismiss={close}
        onConfirm={() => goTo(paths.confirm)}
      />
      <Modal
        open={open && isRestartStep}
        title="새로 시작하면 현재 사건을 이어갈 수 없어요"
        description={
          <>
            확인 중인 사건은 종료되며,
            <br />
            사용한 1톨은 반환되지 않아요.
          </>
        }
        cancelText="계속 확인하기"
        confirmText="새로 시작하기"
        onCancel={() => goTo(paths.confirm)}
        onDismiss={close}
        onConfirm={() => {
          clearPendingCase()
          goTo(paths.upload)
        }}
      />
    </>
  )
}

export default PendingCaseModals
