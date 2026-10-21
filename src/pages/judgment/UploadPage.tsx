// AI 재판 - 대화 캡처 업로드 페이지 (2.1.1)
// 헤더는 JudgmentLayout에서!

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadRabbits from '../../assets/judgment/upload-rabbits.mp4'
import Button from '../../components/Button'
import ChipSelect from '../../components/ChipSelect'
import Modal from '../../components/modal/Modal'
import PhotoUploadBox from '../../components/PhotoUploadBox'
import type { Photo } from '../../components/PhotoUploadBox'
import Toast from '../../components/Toast'
import { TOLL_PER_CASE, useCoinBalance } from '../../hooks/useCoinBalance'
import { useSubmitCase } from '../../hooks/useSubmitCase'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { useUploadDraftStore } from '../../store/useUploadDraftStore'
import { RELATIONS, type CaseRelation } from '../../types/case'

// 첨부 가능한 사진 장수
const MIN_PHOTOS = 1
const MAX_PHOTOS = 6

function UploadPage() {
  const navigate = useNavigate()
  // 톨 부족 → 충전 화면에 갔다가 돌아오면, 올려둔 관계 · 사진을 그대로 다시 보여줌
  const draft = useUploadDraftStore((state) => state.draft)
  const setDraft = useUploadDraftStore((state) => state.setDraft)
  const [relation, setRelation] = useState<CaseRelation>(draft?.relation ?? RELATIONS[0]) // 상대와의 관계
  const [photos, setPhotos] = useState<Photo[]>(draft?.photos ?? []) // 대화 캡처
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false) // 사건 접수 확인 모달
  const { toast, showToast, hideToast } = useToast()

  // 보유 톨 (접수 확인 모달에 표시)
  const { data: balance } = useCoinBalance()

  // 사건 접수: 관계 + 대화 캡처 업로드 → 1톨 차감 후 AI 분석 시작 → 사건접수 로딩
  const { submit, isPending } = useSubmitCase({
    onError: (message) => {
      setIsSubmitModalOpen(false)
      showToast(message)
    },
  })

  // 최소 장수를 채워야 CTA 활성화
  const canSubmit = photos.length >= MIN_PHOTOS

  // 모달에서 사건 접수하기
  // 톨이 부족하면 올린 사진을 기억해 두고 톨 부족 창으로 (충전 후 결제 완료에서 그대로 접수)
  const handleConfirmSubmit = () => {
    if (balance !== undefined && balance < TOLL_PER_CASE) {
      setDraft({ relation, photos })
      setIsSubmitModalOpen(false)
      navigate(paths.tollShortage)
      return
    }
    submit({ relation, photos })
  }

  return (
    // 헤더를 뺀 화면 높이를 채워서 토끼 영상이 항상 맨 아래에 붙게 함
    <div className="flex min-h-[calc(100dvh-51px)] flex-col">
      <section className="px-6 pt-3.5 pb-4.5">
        <h2 className="text-h2-semibold text-gray-90">판결받고 싶은 대화를 올려주세요</h2>
        <p className="text-b2-regular mt-1 text-gray-70">여러 장이라면 대화 순서대로 올려주세요.</p>

        <div className="mt-5.75">
          <ChipSelect
            label="상대와의 관계 (필수)"
            options={RELATIONS}
            value={relation}
            onChange={(value) => setRelation(value as CaseRelation)} // 선택지가 RELATIONS뿐이라 항상 CaseRelation
          />
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
        <Button variant="white" disabled={!canSubmit} onClick={() => setIsSubmitModalOpen(true)} className="absolute inset-x-6 bottom-10">
          사건 접수하기
        </Button>
      </div>

      {/* 사건 접수 확인 모달 (첫 가입 때 받은 1톨도 같은 방식으로 사용) */}
      {/* 취소 → 이 화면에 그대로 */}
      <Modal
        open={isSubmitModalOpen}
        title={`${TOLL_PER_CASE}톨을 사용해 사건을 접수할까요?`}
        description={
          <>
            접수하면 {TOLL_PER_CASE}톨이 차감돼요.
            <br />
            {balance !== undefined && <span className="text-keycolor-100">현재 보유: {balance}톨</span>}
          </>
        }
        cancelText="취소"
        confirmText={isPending ? '접수하는 중...' : '사건 접수하기'}
        wideConfirm
        onCancel={() => {
          if (!isPending) setIsSubmitModalOpen(false)
        }}
        onConfirm={handleConfirmSubmit}
      />
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default UploadPage
