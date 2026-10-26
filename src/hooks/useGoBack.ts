// 들어온 화면으로 돌아가는 뒤로가기
// 주소를 직접 입력해서 들어와 이전 화면이 없으면 홈으로 이동

import { useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'

export const useGoBack = (fallback: string = paths.home) => {
  const navigate = useNavigate()

  return () => {
    const hasPrevious = ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0
    if (hasPrevious) navigate(-1)
    else navigate(fallback)
  }
}
