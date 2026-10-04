// 공통 텍스트 입력창 컴포넌트

import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

function Textarea({ className = '', rows = 1, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={`text-l1-medium field-sizing-content block w-full resize-none rounded-lg bg-white-100 px-2.5 py-3.75 text-gray-100 outline-none placeholder:text-gray-50 ${className}`}
      {...props}
    />
  )
}

export default Textarea
