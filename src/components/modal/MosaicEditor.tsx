// 사진 모자이크 편집 (전체 화면 모달)
// 가리기: 사진에서 문지르는 곳마다 모자이크가 칠해짐 / 이동: 사진을 위아래로 넘겨보기
// 완료하면 모자이크가 입혀진 새 이미지 주소를 onSave로 돌려줌

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { applyMosaic, createMosaicGrid } from '../../utils/mosaic'
import type { MosaicGrid } from '../../utils/mosaic'
import Button from '../Button'

// 손가락 마우스 한 번에 칠해지는 범위: 누른 칸 + 주변 칸 (1 → 3×3칸)
const BRUSH_RADIUS = 1

const MODES = { paint: '가리기', move: '이동' } as const
type Mode = keyof typeof MODES

// 칸 번호 목록을 캔버스에 칸 평균 색으로 칠함
const paintCells = (context: CanvasRenderingContext2D, grid: MosaicGrid, cells: Iterable<number>) => {
  for (const cell of cells) {
    const i = cell * 4
    context.fillStyle = `rgba(${grid.colors[i]}, ${grid.colors[i + 1]}, ${grid.colors[i + 2]}, ${grid.colors[i + 3] / 255})`
    context.fillRect(cell % grid.cols, Math.floor(cell / grid.cols), 1, 1)
  }
}

type MosaicEditorProps = {
  src: string
  onCancel: () => void
  onSave: (editedSrc: string) => void | Promise<void>
}

function MosaicEditor({ src, onCancel, onSave }: MosaicEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null) // 모자이크 미리보기 
  const [grid, setGrid] = useState<MosaicGrid | null>(null)
  const [strokes, setStrokes] = useState<number[][]>([]) // 문지른 한 번마다 칠한 칸 번호
  const [mode, setMode] = useState<Mode>('paint')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const stroke = useRef<{ cells: Set<number>; x: number; y: number } | null>(null) // 지금 문지르는 중인 획

  // 지금까지 칠한 칸 전체
  const paintedCells = useMemo(() => new Set(strokes.flat()), [strokes])

  // 화면에 뜨자마자 모달로 열기
  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  // 사진을 격자로 나누고 칸별 색 계산
  useEffect(() => {
    let cancelled = false
    createMosaicGrid(src).then((created) => {
      if (!cancelled) setGrid(created)
    }).catch(() => {
      if (!cancelled) setError('이미지를 불러오지 못했어요. 닫고 다시 시도해 주세요.')
    })
    return () => {
      cancelled = true
    }
  }, [src])

  // 칠한 칸이 바뀌면 미리보기를 처음부터 다시 그림
  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')
    if (!grid || !context) return
    context.clearRect(0, 0, grid.cols, grid.rows)
    paintCells(context, grid, paintedCells)
  }, [grid, paintedCells])

  // 화면 좌표 → 원본 사진 좌표
  const toPhotoPoint = (event: PointerEvent<HTMLDivElement>, grid: MosaicGrid) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * grid.width,
      y: ((event.clientY - rect.top) / rect.height) * grid.height,
    }
  }

  // 한 지점 주변 칸들을 칠함
  const paintAt = (grid: MosaicGrid, x: number, y: number, cells: Set<number>) => {
    const col = Math.floor(x / grid.block)
    const row = Math.floor(y / grid.block)
    const added: number[] = []
    for (let dy = -BRUSH_RADIUS; dy <= BRUSH_RADIUS; dy++) {
      for (let dx = -BRUSH_RADIUS; dx <= BRUSH_RADIUS; dx++) {
        const c = col + dx
        const r = row + dy
        if (c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) continue
        const cell = r * grid.cols + c
        if (!cells.has(cell)) {
          cells.add(cell)
          added.push(cell)
        }
      }
    }
    // 문지르는 중에는 새로 칠한 칸만 바로 그려서 빠르게 반응
    const context = canvasRef.current?.getContext('2d')
    if (context) paintCells(context, grid, added)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!grid || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const { x, y } = toPhotoPoint(event, grid)
    stroke.current = { cells: new Set(), x, y }
    paintAt(grid, x, y, stroke.current.cells)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!grid || !stroke.current) return
    const { x, y } = toPhotoPoint(event, grid)
    // 빠르게 문질러도 중간이 비지 않게 이전 지점부터 반 칸 간격으로 이어서 칠함
    const distance = Math.hypot(x - stroke.current.x, y - stroke.current.y)
    const steps = Math.max(1, Math.ceil(distance / (grid.block / 2)))
    for (let step = 1; step <= steps; step++) {
      const t = step / steps
      paintAt(grid, stroke.current.x + (x - stroke.current.x) * t, stroke.current.y + (y - stroke.current.y) * t, stroke.current.cells)
    }
    stroke.current.x = x
    stroke.current.y = y
  }

  const handlePointerEnd = () => {
    const cells = stroke.current?.cells
    stroke.current = null
    if (cells && cells.size > 0) setStrokes((prev) => [...prev, [...cells]])
  }

  const handleSave = async () => {
    if (paintedCells.size === 0) return onCancel() // 바뀐 게 없으면 그냥 닫기
    setIsSaving(true)
    setError('')
    try {
      await onSave(await applyMosaic(src, paintedCells))
    } catch {
      setError('편집 이미지를 저장하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  const isPainting = mode === 'paint'

  return (
    <dialog
      ref={dialogRef}
      aria-label="사진 가리기"
      // Esc → 취소
      onCancel={(event) => {
        event.preventDefault()
        if (!isSaving) onCancel()
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-gray-100 text-white-100 backdrop:bg-black/60 open:motion-safe:animate-[fade-up_300ms_ease-out_both]"
    >
      <div className="mx-auto flex h-full max-w-98.25 flex-col">
        <header className="flex h-12.75 shrink-0 items-center justify-between px-4">
          <Button onClick={onCancel} disabled={isSaving} className="text-b2-regular cursor-pointer px-1 py-2">
            취소
          </Button>
          <h2 className="text-b2-semibold">사진 가리기</h2>
          <Button onClick={handleSave} disabled={isSaving || !grid} className="text-b2-semibold cursor-pointer px-1 py-2 text-keycolor-20 disabled:cursor-default disabled:opacity-40">
            완료
          </Button>
        </header>

        <p className="text-l1-regular shrink-0 px-6 text-center text-gray-30">
          {isPainting ? (
            <>
              가리고 싶은 부분을 문지르면 모자이크돼요.
              <br />
              사진을 넘겨보려면 '이동'을 눌러주세요.
            </>
          ) : (
            <>
              사진을 위아래로 넘겨볼 수 있어요.
              <br />
              다시 가리려면 '가리기'를 눌러주세요.
            </>
          )}
        </p>

        {error && <p role="alert" className="px-6 pt-2 text-center">{error}</p>}

        {/* 사진 (세로로 긴 캡처는 위아래로 스크롤) */}
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-6 pb-4">
          <div
            onPointerDown={isPainting ? handlePointerDown : undefined}
            onPointerMove={isPainting ? handlePointerMove : undefined}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onLostPointerCapture={handlePointerEnd}
            // 가리기 중에는 손가락으로 문질러도 화면이 스크롤되지 않게 (touch-none)
            className={`relative overflow-hidden rounded-lg select-none ${isPainting ? 'cursor-crosshair touch-none' : ''}`}
          >
            <img src={src} alt="편집 중인 대화 캡처" draggable={false} className="block w-full" />
            {/* 모자이크 미리보기 */}
            {grid && (
              <canvas
                ref={canvasRef}
                width={grid.cols}
                height={grid.rows}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 [image-rendering:pixelated]"
                style={{
                  width: `${((grid.cols * grid.block) / grid.width) * 100}%`,
                  height: `${((grid.rows * grid.block) / grid.height) * 100}%`,
                }}
              />
            )}
          </div>
        </div>

        {/* 도구: 가리기, 이동 / 되돌리기 / 전체 지우기 */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-80 px-6 pt-3 pb-8">
          <div role="radiogroup" aria-label="편집 도구" className="flex gap-1.5">
            {(Object.keys(MODES) as Mode[]).map((key) => (
              <Button
                key={key}
                role="radio"
                aria-checked={mode === key}
                onClick={() => setMode(key)}
                className={`text-l1-medium cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-200 motion-reduce:transition-none ${mode === key ? 'bg-white-100 text-gray-100' : 'bg-gray-80 text-gray-30'}`}
              >
                {MODES[key]}
              </Button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setStrokes(strokes.slice(0, -1))} disabled={strokes.length === 0} className="text-l1-medium cursor-pointer disabled:cursor-default disabled:opacity-40">
              되돌리기
            </Button>
            <Button onClick={() => setStrokes([])} disabled={strokes.length === 0} className="text-l1-medium cursor-pointer disabled:cursor-default disabled:opacity-40">
              전체 지우기
            </Button>
          </div>
        </div>
        {/* 가린 부분 안내 */}
        <p role="status" className="sr-only">
          {strokes.length > 0 ? `${strokes.length}번 가렸어요.` : ''}
        </p>
      </div>
    </dialog>
  )
}

export default MosaicEditor
