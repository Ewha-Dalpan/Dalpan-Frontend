// 공유하기: 화면 캡처 이미지 만들기 + SNS별 공유
//
// 웹에서 SNS로 보낼 수 있는 것 (각 SNS 정책)
// - 페이스북 · X · 메신저: 링크만 가능 (웹에서 이미지를 직접 붙일 수 없음)
// - 인스타그램: 웹 공유 주소가 없어서, 휴대폰 공유 창(Web Share)으로 이미지를 넘겨야 함
// - 휴대폰 공유 창(인스타그램 · 더보기): 이미지 + 링크를 함께 보낼 수 있음
//   (PC 등 지원 안 되는 곳에서는 이미지 저장 + 링크 복사로 대신함)

import { toBlob } from 'html-to-image'

export type ShareTarget = 'link' | 'instagram' | 'messenger' | 'facebook' | 'x' | 'more'

type ShareContent = {
  url: string
  text: string
  image: Promise<File | null> | null // 미리 만들어 둔 캡처 이미지
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

// ---------- 캡처 이미지 ----------

// 'U+AC00-AC2F, U+3131' 같은 unicode-range 안에 쓰인 글자가 하나라도 있는지
const coversAny = (range: string, codes: Set<number>) =>
  range.split(',').some((part) => {
    const [start, end = start] = part.trim().replace(/^U\+/i, '').split('-')
    const from = parseInt(start.replace(/\?/g, '0'), 16)
    const to = parseInt(end.replace(/\?/g, 'F'), 16)
    for (const code of codes) if (code >= from && code <= to) return true
    return false
  })

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

// Pretendard 웹폰트는 수백 개 조각으로 나뉘어 있어서, 캡처할 영역에 실제로 쓰인 글자·굵기 조각만 골라 이미지에 넣음
// (전부 넣으면 수백 개를 내려받아 매우 느려짐. 이미 화면에 쓰인 조각이라 브라우저 캐시에서 바로 가져옴)
const buildFontCss = async (node: HTMLElement) => {
  const codes = new Set([...node.innerText].map((char) => char.codePointAt(0) ?? 0))
  const weights = new Set([node, ...node.querySelectorAll<HTMLElement>('*')].map((el) => getComputedStyle(el).fontWeight))

  const rules: CSSFontFaceRule[] = []
  for (const sheet of document.styleSheets) {
    let cssRules: CSSRuleList
    try {
      cssRules = sheet.cssRules
    } catch {
      continue // 읽을 수 없는 외부 스타일시트는 건너뜀
    }
    for (const rule of cssRules) {
      if (!(rule instanceof CSSFontFaceRule)) continue
      const range = rule.style.getPropertyValue('unicode-range')
      if (weights.has(rule.style.fontWeight) && (!range || coversAny(range, codes))) rules.push(rule)
    }
  }

  const faces = await Promise.all(
    rules.map(async (rule) => {
      const src = rule.style.getPropertyValue('src').match(/url\(["']?([^"')]+)["']?\)/)?.[1]
      if (!src) return ''
      const response = await fetch(new URL(src, rule.parentStyleSheet?.href ?? location.href))
      const dataUrl = await blobToDataUrl(await response.blob())
      const range = rule.style.getPropertyValue('unicode-range')
      return `@font-face{font-family:${rule.style.fontFamily};font-weight:${rule.style.fontWeight};font-style:${rule.style.fontStyle || 'normal'};src:url(${dataUrl}) format("woff2");${range ? `unicode-range:${range};` : ''}}`
    }),
  )
  return faces.join('')
}

// 화면의 한 영역을 PNG 파일로 캡처 (실패하면 null)
export const captureImage = async (node: HTMLElement | null, fileName: string) => {
  if (!node) return null
  try {
    const blob = await toBlob(node, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      fontEmbedCSS: await buildFontCss(node),
    })
    return blob ? new File([blob], fileName, { type: 'image/png' }) : null
  } catch {
    return null
  }
}

// ---------- 공유 ----------

const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}

const saveImage = (file: File) => {
  const href = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = href
  link.download = file.name
  link.click()
  URL.revokeObjectURL(href)
}

// 휴대폰 공유 창으로 이미지 + 링크 보내기. 지원 안 되면 이미지 저장 + 링크 복사
const shareWithImage = async ({ url, text, image }: ShareContent, fallbackMessage: string) => {
  const file = await image
  const files = file ? [file] : []
  if (navigator.canShare?.({ files, text, url })) {
    try {
      await navigator.share({ files, text, url })
    } catch {
      // 사용자가 공유 창을 닫은 경우 등은 조용히 무시
    }
    return null
  }
  if (file) saveImage(file)
  await copyLink(url)
  return fallbackMessage
}

// 누른 공유 방법대로 공유하고, 띄울 토스트 문구를 돌려줌 (없으면 null)
// 페이스북·X는 팝업 차단을 피하려고 await 전에(클릭 직후 바로) 새 창을 엶
export const shareTo = async (target: ShareTarget, content: ShareContent) => {
  const url = encodeURIComponent(content.url)
  const text = encodeURIComponent(content.text)

  switch (target) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener')
      return null
    case 'x':
      window.open(`https://x.com/intent/post?text=${text}&url=${url}`, '_blank', 'noopener')
      return null
    case 'messenger':
      // 휴대폰: 메신저 앱으로 링크 보내기 / PC: 웹 공유 주소가 없어서 링크 복사
      if (isMobile()) {
        location.href = `fb-messenger://share/?link=${url}`
        return null
      }
      return (await copyLink(content.url)) ? '링크를 복사했습니다. 메신저에 붙여넣어 주세요.' : '링크를 복사하지 못했습니다.'
    case 'link':
      return (await copyLink(content.url)) ? '링크를 복사했습니다.' : '링크를 복사하지 못했습니다.'
    case 'instagram':
      return shareWithImage(content, '판결문 이미지를 저장했습니다. 인스타그램에 올려보세요.')
    case 'more':
      return shareWithImage(content, '판결문 이미지를 저장하고 링크를 복사했습니다.')
  }
}
