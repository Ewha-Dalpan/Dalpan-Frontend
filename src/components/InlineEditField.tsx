// 공통 인라인 수정 필드 (제목 + 텍스트 박스)
// editable(기본)이면 흰 박스를 눌러 바로 수정, false면 회색 읽기 전용 박스

import { useId, useRef } from 'react'
import pencilIcon from '../assets/edit-field/pencil.svg'
import Button from './Button'

type InlineEditFieldProps = {
  label: string
  value: string
  onChange?: (value: string) => void
  editable?: boolean
}

function InlineEditField({ label, value, onChange, editable = true }: InlineEditFieldProps) {
  const id = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 연필 아이콘을 누르면 입력칸 맨 끝으로 커서 이동
  const focusField = () => {
    const field = textareaRef.current
    if (!field) return
    field.focus()
    field.setSelectionRange(field.value.length, field.value.length)
  }

  if (!editable) {
    return (
      <div>
        <p className="text-b2-regular text-gray-100">{label}</p>
        <p className="text-b2-regular mt-2.25 rounded-lg bg-gray-5 px-4 py-3.5 text-gray-70">{value}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex h-5.75 items-center justify-between">
        <label htmlFor={id} className="text-b2-regular text-gray-100">
          {label}
        </label>
        <Button aria-label={`${label} 수정`} onClick={focusField} className="-my-1.25 cursor-pointer">
          <img src={pencilIcon} alt="" className="block max-w-none" />
        </Button>
      </div>
      {/* 내용 길이에 맞춰 높이가 늘어나는 입력칸 */}
      <textarea
        ref={textareaRef}
        id={id}
        rows={1}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="text-b2-regular field-sizing-content mt-2.25 block w-full resize-none rounded-lg bg-white-100 px-4 py-3.5 text-gray-100 outline-none focus-visible:outline-2 focus-visible:outline-keycolor-40"
      />
    </div>
  )
}

export default InlineEditField
