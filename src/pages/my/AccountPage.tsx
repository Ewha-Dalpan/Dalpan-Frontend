// 마이 > 계정 관리: 로그인한 카카오 계정 확인, 회원 탈퇴

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { withdraw } from '../../apis/accountApi'
import Header from '../../components/Header'
import Modal from '../../components/modal/Modal'
import Toast from '../../components/Toast'
import { useSignOut } from '../../hooks/useSignOut'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { getApiErrorMessage } from '../../utils/apiError'
import KakaoIcon from '../onboarding/KakaoIcon'

function AccountPage() {
  const navigate = useNavigate()
  const signOut = useSignOut()
  const { toast, showToast, hideToast } = useToast()
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  const withdrawal = useMutation({
    mutationFn: withdraw,
    onSuccess: () => signOut('탈퇴가 완료됐어요. 그동안 이용해 주셔서 감사해요.'),
    onError: (error) => {
      setIsWithdrawModalOpen(false)
      showToast(getApiErrorMessage(error))
    },
  })

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-bg text-white-100">
      <Header depth={2} title="계정 관리" onBack={() => navigate(paths.my)} />

      <main>
        <h2 className="text-b2-medium mx-6 mt-2.75 text-gray-10">계정 정보</h2>
        <div className="mx-6 mt-2.5 flex h-12 items-center gap-1.25 rounded-lg bg-gray-5 px-4">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fbe84c]">
            <KakaoIcon className="h-[16.071px] w-[14.516px]" />
          </span>
          {/* TODO: 내 정보 API에 이메일이 생기면 이메일로 교체 (피그마는 이메일 표시) */}
          <p className="text-b2-regular text-gray-60">카카오 계정으로 로그인 중</p>
        </div>

        <h2 className="text-b2-medium mx-6 mt-8.5 text-gray-10">계정 관리</h2>
        <button
          type="button"
          onClick={() => setIsWithdrawModalOpen(true)}
          className="text-b2-medium mt-2.5 flex h-11.5 w-full cursor-pointer items-center bg-white-100/10 pl-6.5 text-left"
        >
          회원 탈퇴
        </button>
      </main>

      {/* 탈퇴 확인 팝업 (디자인이 없어서 로그아웃 팝업과 같은 공통 모달 사용) */}
      <Modal
        open={isWithdrawModalOpen}
        title="회원 탈퇴"
        description={
          <>
            탈퇴하면 남은 톨이 모두 사라지고
            <br />
            되돌릴 수 없어요.
          </>
        }
        cancelText="취소"
        confirmText="탈퇴하기"
        wideConfirm
        onCancel={() => setIsWithdrawModalOpen(false)}
        onConfirm={() => {
          if (!withdrawal.isPending) withdrawal.mutate()
        }}
      />
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default AccountPage
