// 페이지가 바뀌면 항상 맨 위에서 시작 (App에서 라우터 안에 한 번만 둠!!)

import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 뒤로가기 할 때 브라우저가 예전 스크롤 위치로 되돌리지 않게 (항상 맨 위로 통일)
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

function ScrollToTop() {
  const { pathname } = useLocation()

  // 화면을 그리기 직전에 올려서, 아래로 내려간 채로 잠깐 보이는 깜빡임이 없게 함
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
