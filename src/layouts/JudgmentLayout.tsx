// AI 재판 페이지 배경이 크림색이라 크림색 페이지에만 적용시킨 레이아웃입니다!!

import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Modal from '../components/Modal'
import { paths } from '../routes/paths'

function JudgmentLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false) // 상황확인 나가기 모달

  // 상황확인은 이미 사건이 접수된 뒤라 바로 나가지 않고 모달로 한 번 더 확인
  const isConfirm = pathname === paths.confirm

  return (
    <div className="mx-auto min-h-dvh w-full max-w-98.25 bg-bg-light text-gray-90">
      {/* 업로드는 뒤로가기 시 홈으로 */}
      <Header
        depth={2}
        theme="light"
        title="AI 재판"
        onBack={() => (isConfirm ? setIsLeaveModalOpen(true) : navigate(paths.home))}
      />
      <main><Outlet /></main>

      {/* 계속하기 → 상황확인 그대로 / 나가기 → 홈 (사건은 저장돼서 홈에서 이어서 할 수 있음) */}
      <Modal
        open={isLeaveModalOpen}
        title="상황 확인을 나갈까요?"
        description={
          <>
            사건은 저장되어 다음에 이어서 확인할 수 있어요.
            <br />
            사용한 1톨은 반환되지 않아요.
          </>
        }
        cancelText="계속하기"
        confirmText="나가기"
        onCancel={() => setIsLeaveModalOpen(false)}
        onConfirm={() => {
          setIsLeaveModalOpen(false)
          navigate(paths.home)
        }}
      />
    </div>
  )
}

export default JudgmentLayout
