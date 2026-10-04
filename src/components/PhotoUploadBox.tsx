// 공통 사진 첨부 컴포넌트 (다중 첨부 + 개별 삭제)

import { useId } from 'react'
import type { ChangeEvent } from 'react'
import cameraIcon from '../assets/upload/camera.svg'
import deleteIcon from '../assets/upload/photo-delete.svg'
import Button from './Button'

export type Photo = {
  id: string
  file: File
  previewUrl: string
}

type PhotoUploadBoxProps = {
  photos: Photo[]
  onChange: (photos: Photo[]) => void
  min?: number
  max?: number
  label?: string
}

function PhotoUploadBox({ photos, onChange, min = 1, max = 6, label = '이미지 첨부 (필수)' }: PhotoUploadBoxProps) {
  const labelId = useId()
  const hintId = useId()
  const isFull = photos.length >= max
  const showHint = photos.length < min

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    const added = selected.slice(0, max - photos.length).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    onChange([...photos, ...added])
    // 같은 파일을 다시 선택해도 onChange가 실행되도록 초기화!!
    event.target.value = ''
  }

  const handleDelete = (target: Photo) => {
    URL.revokeObjectURL(target.previewUrl)
    onChange(photos.filter((photo) => photo.id !== target.id))
  }

  return (
    <div>
      <p id={labelId} className="text-b2-medium text-black">{label}</p>
      <div className="mt-1.25 flex overflow-x-auto scrollbar-none">
        {/* 첨부 버튼 */}
        <div className="shrink-0 pt-1.75 pr-2.25">
          <label
            className={`flex h-18.25 w-17.75 flex-col items-center justify-center rounded-sm border border-dashed border-[#c7a29d] has-focus-visible:outline-2 ${isFull ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isFull}
              onChange={handleSelect}
              aria-labelledby={labelId}
              aria-describedby={showHint ? hintId : undefined}
              className="sr-only"
            />
            <img src={cameraIcon} alt="" className="block max-w-none" />
            <span className="text-[10px] leading-normal font-medium tracking-[-0.03em] text-[#c7a29d]">
              사진 {photos.length}/{max}
            </span>
          </label>
        </div>

        {/* 썸네일 목록 */}
        <ul className="flex">
          {photos.map((photo, index) => (
            <li key={photo.id} className="relative shrink-0 pt-1.75 pr-2.25">
              <img
                src={photo.previewUrl}
                alt={`첨부한 사진 ${index + 1}`}
                className="block h-18.25 w-17.75 rounded-sm bg-white-100/70 object-cover"
              />
              <Button
                type="button"
                aria-label={`${index + 1}번째 사진 삭제`}
                onClick={() => handleDelete(photo)}
                className="absolute top-0 right-0 size-5.5 cursor-pointer"
              >
                <img src={deleteIcon} alt="" className="block max-w-none" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {showHint && (
        <p id={hintId} className="mt-2.25 text-center text-[10px] leading-normal text-gray-60">
          최소 {min}장 이상 첨부해야 합니다.
        </p>
      )}
    </div>
  )
}

export default PhotoUploadBox
