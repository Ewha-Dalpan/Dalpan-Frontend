// AI 재판 - 대화 캡처 업로드 페이지 (2.1.1)
// 헤더는 JudgmentLayout에서!

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadRabbits from '../../assets/judgment/upload-rabbits.mp4'
import Button from '../../components/Button'
import ChipSelect from '../../components/ChipSelect'
import Modal from '../../components/Modal'
import PhotoUploadBox from '../../components/PhotoUploadBox'
import type { Photo } from '../../components/PhotoUploadBox'
import { paths } from '../../routes/paths'
import { useCaseStore } from '../../store/useCaseStore'

// 첨부 가능한 사진 장수
const MIN_PHOTOS = 1
const MAX_PHOTOS = 6

// 상대와의 관계 선택지
const RELATIONS = ['연애', '친구', '가족', '학교∙팀플', '기타'] as const

// TODO: API 연동 시 사용자의 무료 이용권 보유 여부·보유 톨로 교체 (무료 이용권은 회원가입 시 1회 지급)
const HAS_FREE_TICKET = true
const TOLL_COUNT = 5

// 사건 1건 접수에 드는 톨
const TOLL_PER_CASE = 1

function UploadPage() {
  const navigate = useNavigate()
  const [relation, setRelation] = useState<string>(RELATIONS[0]) // 상대와의 관계
  const [photos, setPhotos] = useState<Photo[]>([]) // 대화 캡처
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false) // 사건 접수 확인 모달
  const receiveCase = useCaseStore((state) => state.receiveCase)

  // 최소 장수를 채워야 CTA 활성화
  const canSubmit = photos.length >= MIN_PHOTOS

  // 모달에서 사건 접수하기 → 사건접수 로딩
  // TODO: 결제하기 화면이 생기면 무료 이용권이 없고 톨이 부족할 때(TOLL_COUNT < TOLL_PER_CASE) 결제로 이동
  const handleConfirmSubmit = () => {
    receiveCase()
    navigate(paths.received)
  }

  return (
    // 헤더를 뺀 화면 높이를 채워서 토끼 영상이 항상 맨 아래에 붙게 함
    <div className="flex min-h-[calc(100dvh-51px)] flex-col">
      <section className="px-6 pt-3.5 pb-4.5">
        <h2 className="text-h2-semibold text-gray-90">판결받고 싶은 대화를 올려주세요</h2>
        <p className="text-b2-regular mt-1 text-gray-70">여러 장이라면 대화 순서대로 올려주세요.</p>

        <div className="mt-5.75">
          <ChipSelect label="상대와의 관계 (필수)" options={RELATIONS} value={relation} onChange={setRelation} />
        </div>

        <div className="mt-8.25">
          <PhotoUploadBox photos={photos} onChange={setPhotos} min={MIN_PHOTOS} max={MAX_PHOTOS} />
        </div>
      </section>

      {/* 하단 토끼 애니메이션 + CTA (버튼이 영상 위에 겹쳐지게...) */}
      <div className="relative mt-auto size-98.25">
        {/* 장식용 영상이라 화면 낭독기에서는 숨김 */}
        <video
          src={uploadRabbits}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="block size-full object-cover"
        />
        {/* TODO: API 연동 시 관계·사진 함께 넘기기 */}
        <Button variant="white" disabled={!canSubmit} onClick={() => setIsSubmitModalOpen(true)} className="absolute inset-x-6 bottom-10">
          사건 접수하기
        </Button>
      </div>

      {/* 사건 접수 확인 모달: 무료 이용권이 있으면 이용권 문구, 없으면 톨 차감 문구 */}
      {/* 취소 → 이 화면에 그대로 */}
      <Modal
        open={isSubmitModalOpen}
        title={HAS_FREE_TICKET ? '무료 이용권을 사용하겠습니까?' : `${TOLL_PER_CASE}톨을 사용해 사건을 접수할까요?`}
        description={
          HAS_FREE_TICKET ? (
            <>
              첫 회원 가입 이후 제공되는 무료 이용권
              <br />
              1회를 사용해 결제합니다.
            </>
          ) : (
            <>
              접수하면 {TOLL_PER_CASE}톨이 차감돼요.
              <br />
              <span className="text-keycolor-100">현재 보유: {TOLL_COUNT}톨</span>
            </>
          )
        }
        cancelText="취소"
        confirmText="사건 접수하기"
        wideConfirm
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  )
}

export default UploadPage
