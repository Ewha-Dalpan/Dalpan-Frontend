import { useEffect, useRef } from 'react'
import type { DragEvent, KeyboardEvent, MouseEvent, PointerEvent } from 'react'

export const useHorizontalScroll = (step: number) => {
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean; scale: number } | null>(null)

  const suppressClick = useRef(false)
  const frame = useRef<number | null>(null)
  const pending = useRef<{ element: HTMLElement; left: number } | null>(null)

  const flush = () => {
    if (pending.current) pending.current.element.scrollLeft = pending.current.left
    pending.current = null
    frame.current = null
  }

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    suppressClick.current = false
    if (event.pointerType !== 'mouse' || !event.isPrimary || event.button !== 0) return
    drag.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false, scale: event.currentTarget.getBoundingClientRect().width / event.currentTarget.offsetWidth }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!drag.current) return
    const dx = (event.clientX - drag.current.x) / drag.current.scale
    if (!drag.current.moved) {
      if (Math.abs(dx) < 5) return
      drag.current.moved = true
      suppressClick.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    pending.current = { element: event.currentTarget, left: drag.current.scrollLeft - dx }
    if (frame.current === null) frame.current = requestAnimationFrame(flush)
  }

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    flush()
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? step : -step, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return {
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false }
    },
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onLostPointerCapture: endDrag,
    onKeyDown,
    onDragStart: (event: DragEvent<HTMLElement>) => event.preventDefault(),
  }
}
