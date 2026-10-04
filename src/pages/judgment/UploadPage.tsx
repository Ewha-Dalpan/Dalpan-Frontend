// AI 재판 - 대화 캡처 업로드 페이지 (2.1.1)

import { useState } from 'react'
import PhotoUploadBox from '../../components/PhotoUploadBox'
import type { Photo } from '../../components/PhotoUploadBox'
import Textarea from '../../components/Textarea'

function UploadPage() {
  const [detail, setDetail] = useState('')
  const [photos, setPhotos] = useState<Photo[]>([])

  return (
    <div className="px-6 pt-4">
      <Textarea
        placeholder="(선택) 상세 내용을 입력해주세요."
        value={detail}
        onChange={(event) => setDetail(event.target.value)}
      />
      <div className="mt-2.75">
        <PhotoUploadBox photos={photos} onChange={setPhotos} min={1} max={6} />
      </div>
    </div>
  )
}

export default UploadPage
