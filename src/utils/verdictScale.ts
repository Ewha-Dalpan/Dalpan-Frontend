// 과실비율 저울 계산 
// 저울 그림(VerdictScale)과 과실 비율 배지 위치(VerdictSummary, VerdictBoard)에서 같이 사용

import scale1 from '../assets/verdict/scale-1.svg'
import scale2 from '../assets/verdict/scale-2.svg'
import scale4 from '../assets/verdict/scale-4.svg'
import scale6 from '../assets/verdict/scale-6.svg'

export type Point = [number, number]

// 저울 
const DRAW_WIDTH = 274.538

type Variant = { src: string; width: number; height: number; panWidth: number; left: Point; right: Point }
const VARIANTS: Record<1 | 2 | 4 | 6, Variant> = {
  1: { src: scale1, width: 620, height: 514, panWidth: 182.54, left: [40.22, 146], right: [435.42, 148] },
  2: { src: scale2, width: 604, height: 514, panWidth: 177.82, left: [26, 123.19], right: [424, 169.19] },
  4: { src: scale4, width: 604, height: 514, panWidth: 177.82, left: [40, 68], right: [391, 212] },
  6: { src: scale6, width: 604, height: 514, panWidth: 177.82, left: [66, 14], right: [349, 266] },
}

// 접시 안 떡 위치 (접시 왼쪽 위 기준, 개수별)
const CAKE_SLOTS: Point[][] = [
  [],
  [[34, 112]],
  [[14, 118], [68, 110]],
  [[18, 120], [79, 108], [36, 71]],
  [[10, 120], [74, 112], [28, 76], [80, 66]],
  [[8, 122], [70, 116], [26, 82], [84, 72], [48, 36]],
]
const CAKE_SIZE = 104.4

// 내 과실(%) → 떡 개수 (나 : 상대), 합은 5
// 0~9: 0:5 / 10~29: 1:4 / 30~49: 2:3 / 50~69: 3:2 / 70~89: 4:1 / 90~100: 5:0
// 단, 정확히 50 : 50이면 수평 저울에 떡도 2 : 2로 똑같이 (설계서 구간표에 없는 경우)
const cakesFor = (myRatio: number) => {
  if (myRatio === 50) return { my: 2, other: 2 }
  const my = myRatio < 10 ? 0 : myRatio < 30 ? 1 : myRatio < 50 ? 2 : myRatio < 70 ? 3 : myRatio < 90 ? 4 : 5
  return { my, other: 5 - my }
}

// 저울 모양: 어떤 저울 그림을 쓰는지, 뒤집는지, 화면 왼쪽(나)/오른쪽(상대) 접시 위치, 떡 위치
export const getScaleLayout = (myRatio: number) => {
  const cakes = cakesFor(myRatio)
  const gap = Math.abs(cakes.other - cakes.my) // 0, 1, 3, 5
  const variant = VARIANTS[gap === 5 ? 6 : gap === 3 ? 4 : gap === 1 ? 2 : 1]
  const flipped = cakes.my > cakes.other // 내 쪽이 무거우면 왼쪽이 내려가게 뒤집음
  const draw = DRAW_WIDTH / variant.width // 원본 → 화면 배율
  const panWidth = variant.panWidth

  const mirror = ([x, y]: Point): Point => [variant.width - x - panWidth, y]
  const toDraw = ([x, y]: Point): Point => [x * draw, y * draw]
  const leftPan = toDraw(flipped ? mirror(variant.right) : variant.left)
  const rightPan = toDraw(flipped ? mirror(variant.left) : variant.right)

  // 접시 안에 떡 놓기 (뒤집힌 저울에서는 접시 안에서도 좌우 반대로, 떡 그림 자체는 안 뒤집음)
  const placeCakes = ([panX, panY]: Point, count: number) =>
    CAKE_SLOTS[count].map(([x, y]) => {
      const offsetX = flipped ? (panWidth - x - CAKE_SIZE) * draw : x * draw
      return { x: panX + offsetX, y: panY + y * draw, size: CAKE_SIZE * draw }
    })

  return {
    src: variant.src,
    imageHeight: variant.height * draw, // 저울 그림 높이
    flipped,
    leftPan,
    rightPan,
    cakes: [...placeCakes(leftPan, cakes.my), ...placeCakes(rightPan, cakes.other)],
  }
}
