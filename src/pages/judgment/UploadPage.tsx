// AI 재판 - 대화 캡처 업로드 페이지 (2.1.1)
// 헤더는 JudgmentLayout에서!

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadRabbits from '../../assets/judgment/upload-rabbits.mp4'
import Button from '../../components/Button'
import PhotoUploadBox from '../../components/PhotoUploadBox'
import type { Photo } from '../../components/PhotoUploadBox'
import Textarea from '../../components/Textarea'
import { paths } from '../../routes/paths'

// 첨부 가능한 사진 장수
const MIN_PHOTOS = 1
const MAX_PHOTOS = 6

function UploadPage() {
  const navigate = useNavigate()
  const [detail, setDetail] = useState('') // 상세 내용 (선택)
  const [photos, setPhotos] = useState<Photo[]>([]) // 대화 캡처 (필수)

  // 최소 장수를 채워야 CTA 활성화
  const canSubmit = photos.length >= MIN_PHOTOS

  return (
    // 헤더를 뺀 화면 높이를 채워서 토끼 영상이 항상 맨 아래에 붙게 함
    <div className="flex min-h-[calc(100dvh-51px)] flex-col">
      <section className="px-6 pt-4 pb-1.25">
        <h2 className="text-h2-semibold text-gray-90">
          판결받고 싶은 대화를
          <br />
          올려주세요
        </h2>
        <p className="text-b2-regular mt-2 text-gray-70">
          대화 캡처를 올리면 달판이 먼저 상황을 읽어볼게요.
          <br />
          여러 장이라면 순서대로 올려주세요.
        </p>

        <Textarea
          placeholder="(선택) 상세 내용을 입력해주세요."
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          className="mt-3.5"
        />
        <div className="mt-2.75">
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
        {/* TODO: API 연동 시 사진/상세 내용을 함께 넘기기! */}
        <Button
          variant="white"
          disabled={!canSubmit}
          onClick={() => navigate(paths.confirm)}
          className="absolute inset-x-6 bottom-10"
        >
          이 대화 읽어보기
        </Button>
      </div>
    </div>
  )
}

export default UploadPage
