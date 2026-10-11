// 가로 스크롤 목록을 터치, 마우스, 키보드로 모두 넘길 수 있게 하는 훅

import { useRef } from 'react'
import type { DragEvent, KeyboardEvent, PointerEvent } from 'react'

export const useHorizontalScroll = (step: number) => {
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean } | null>(null)

  // 마우스 왼쪽 버튼으로 누를 때만 끌기 시작 (터치는 브라우저 기본 스와이프 사용)
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!drag.current) return
    const dx = event.clientX - drag.current.x
    // 살짝 움직인 건 클릭으로 처리
    if (!drag.current.moved) {
      if (Math.abs(dx) < 5) return
      drag.current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    event.currentTarget.scrollLeft = drag.current.scrollLeft - dx
  }

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  // ← → 방향키로 한 칸씩 이동
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? step : -step, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onKeyDown,
    // 이미지를 끌 때 브라우저 기본 '이미지 드래그'가 끼어들지 않게 막음
    onDragStart: (event: DragEvent<HTMLElement>) => event.preventDefault(),
  }
}
