// 공통 칩 선택 컴포넌트 (여러 칩 중 하나만 선택)
// 내부적으로 라디오 버튼을 써서 키보드 방향키 이동/화면 지원

import { useId } from 'react'

type ChipSelectProps = {
  label: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}

function ChipSelect({ label, options, value, onChange }: ChipSelectProps) {
  // 같은 그룹의 라디오끼리 묶는 이름 (페이지에 여러 개 있어도 안 겹치게)
  const name = useId()

  return (
    <fieldset>
      <legend className="text-b2-regular text-gray-90">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = option === value
          return (
            <label
              key={option}
              className={`text-b2-regular cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200 ease-out motion-reduce:transition-none has-focus-visible:outline-2 ${selected ? 'bg-keycolor-100 text-white-100' : 'bg-white-100 text-gray-90'}`}
            >
              {/* 실제 라디오는 숨기고 칩 모양만 보여주게 함!! */}
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default ChipSelect
