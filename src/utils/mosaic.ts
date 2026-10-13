// 사진 모자이크: 이름/전화번호 같은 개인정보를 가리기 위해 문지른 칸을 픽셀 블록으로 덮음

// 모자이크 블록 크기: 사진 너비를 이 개수로 나눈 칸 (글자를 알아볼 수 없을 만큼 크게)
const BLOCKS_PER_ROW = 40

export type MosaicGrid = {
  width: number // 원본 사진 크기
  height: number
  block: number // 칸 한 변의 원본 픽셀 크기
  cols: number // 칸 개수
  rows: number
  colors: Uint8ClampedArray // 칸마다 평균 색 
}

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })

// 사진을 칸 개수만큼 아주 작게 줄이면 → 줄어든 1픽셀이 곧 그 칸의 평균 색
const shrink = (image: HTMLImageElement, cols: number, rows: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  canvas.getContext('2d')?.drawImage(image, 0, 0, cols, rows)
  return canvas
}

const gridSize = (image: HTMLImageElement) => {
  const width = image.naturalWidth
  const height = image.naturalHeight
  const block = Math.max(1, Math.round(width / BLOCKS_PER_ROW))
  return { width, height, block, cols: Math.ceil(width / block), rows: Math.ceil(height / block) }
}

// 편집 화면용: 사진의 격자 정보와 칸별 색
export const createMosaicGrid = async (src: string): Promise<MosaicGrid> => {
  const image = await loadImage(src)
  const size = gridSize(image)
  const small = shrink(image, size.cols, size.rows)
  const colors = small.getContext('2d')?.getImageData(0, 0, size.cols, size.rows).data ?? new Uint8ClampedArray()
  return { ...size, colors }
}

// 편집 완료: 원본 사진 위에 고른 칸(cells = 칸 번호 목록)만 모자이크를 덮은 새 이미지 주소
export const applyMosaic = async (src: string, cells: Iterable<number>) => {
  const image = await loadImage(src)
  const { width, height, block, cols, rows } = gridSize(image)
  const small = shrink(image, cols, rows)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('이미지를 만들지 못했어요.')

  context.drawImage(image, 0, 0)
  context.imageSmoothingEnabled = false
  for (const cell of cells) {
    const col = cell % cols
    const row = Math.floor(cell / cols)
    // 줄어든 사진의 1픽셀(= 칸 평균 색)을 칸 크기로 키워서 덮음
    context.drawImage(small, col, row, 1, 1, col * block, row * block, block, block)
  }

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('이미지를 만들지 못했어요.'))), 'image/png')
  })
}
