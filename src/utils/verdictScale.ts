// 과실비율 저울 계산 
// 저울 그림(VerdictScale)과 과실 비율 배지 위치(VerdictSummary, VerdictBoard)에서 같이 사용

import scale2 from '../assets/verdict/scale-2.svg'
import scale4 from '../assets/verdict/scale-4.svg'
import scale6 from '../assets/verdict/scale-6.svg'

export type Point = [number, number]

// 저울
const SOURCE_WIDTH = 604
const DRAW = 274.538 / SOURCE_WIDTH
const PAN_WIDTH = 177.82 // 접시(줄 포함) 너비
export const CAKE_SIZE = 104.4 * DRAW // 떡 크기


const VARIANTS: Record<2 | 4 | 6, { src: string; left: Point; right: Point }> = {
  2: { src: scale2, left: [26, 123.19], right: [424, 169.19] },
  4: { src: scale4, left: [40, 68], right: [391, 212] },
  6: { src: scale6, left: [66, 14], right: [349, 266] },
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

// 내 과실(%) → 떡 개수 (나 : 상대), 합은 항상 5
// 0~9: 0:5 / 10~29: 1:4 / 30~49: 2:3 / 50~69: 3:2 / 70~89: 4:1 / 90~100: 5:0
const cakesFor = (myRatio: number) => {
  const my = myRatio < 10 ? 0 : myRatio < 30 ? 1 : myRatio < 50 ? 2 : myRatio < 70 ? 3 : myRatio < 90 ? 4 : 5
  return { my, other: 5 - my }
}

// 저울 모양: 어떤 저울 그림을 쓰는지, 뒤집는지, 화면 왼쪽(나)/오른쪽(상대) 접시 위치, 떡 위치
export const getScaleLayout = (myRatio: number) => {
  const cakes = cakesFor(myRatio)
  const gap = Math.abs(cakes.other - cakes.my) // 1, 3, 5
  const variant = VARIANTS[gap === 5 ? 6 : gap === 3 ? 4 : 2]
  const flipped = cakes.my > cakes.other // 내 쪽이 무거우면 왼쪽이 내려가게 뒤집음

  const mirror = ([x, y]: Point): Point => [SOURCE_WIDTH - x - PAN_WIDTH, y]
  const toDraw = ([x, y]: Point): Point => [x * DRAW, y * DRAW]
  const leftPan = toDraw(flipped ? mirror(variant.right) : variant.left)
  const rightPan = toDraw(flipped ? mirror(variant.left) : variant.right)

  // 접시 안에 떡 놓기 (뒤집힌 저울에서는 접시 안에서도 좌우 반대로, 떡 그림 자체는 안 뒤집음)
  const placeCakes = ([panX, panY]: Point, count: number) =>
    CAKE_SLOTS[count].map(([x, y]): Point => {
      const offsetX = flipped ? PAN_WIDTH * DRAW - x * DRAW - CAKE_SIZE : x * DRAW
      return [panX + offsetX, panY + y * DRAW]
    })

  return {
    src: variant.src,
    flipped,
    leftPan,
    rightPan,
    cakes: [...placeCakes(leftPan, cakes.my), ...placeCakes(rightPan, cakes.other)],
  }
}
