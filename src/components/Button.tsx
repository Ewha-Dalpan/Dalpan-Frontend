// 공통 버튼 컴포넌트
// variant를 넘기면 공통 스타일 적용, 안 넘기면 스타일 없는 기본 버튼!

import type { ButtonHTMLAttributes } from 'react'

// 모든 variant 공통: 글꼴, 모서리
// 마우스 올리면 살짝 커지고, 활성/비활성 바뀔 때 색상이 부드럽게 전환
const baseClassName =
  'text-b2-semibold cursor-pointer rounded-[8px] transition-[scale,color,background-color] duration-200 ease-out enabled:hover:scale-[1.03] motion-reduce:transition-none disabled:cursor-default'

const variantClassNames = {
  // 갈색(키컬러!) 버튼 (대화 캡처로 바로 판결받기)
  primary: 'bg-keycolor-100 px-[10px] py-[8px] text-white-100 disabled:bg-keycolor-40',
  // 흰색 버튼 (이 대화 읽어보기)
  white: 'flex h-10 items-center justify-center bg-white-100 p-2.5 text-gray-90 disabled:text-gray-30',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClassNames
  fullWidth?: boolean
}

function Button({ children, variant, fullWidth = false, type = 'button', className = '', ...props }: ButtonProps) {
  const classNames = [variant && baseClassName, variant && variantClassNames[variant], fullWidth && 'w-full', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classNames || undefined} {...props}>
      {children}
    </button>
  )
}

export default Button
