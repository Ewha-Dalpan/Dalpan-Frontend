// 공통 버튼 컴포넌트

import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>
}

export default Button
