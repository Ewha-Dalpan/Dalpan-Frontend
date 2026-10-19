// 판결문 화면 공통: 주소의 사건 ID 꺼내기 + 최종 판결 불러오기

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getVerdict } from '../apis/verdictApi'

// 주소의 :caseId를 숫자로 (없거나 숫자가 아니면 undefined)
export const useCaseIdParam = () => {
  const { caseId } = useParams()
  const id = Number(caseId)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

// 최종 판결 (판결 로딩에서 받은 판결문을 미리 넣어두면 다시 요청하지 않고 바로 보여줌)
export const useVerdict = (caseId: number | undefined) =>
  useQuery({
    queryKey: ['verdict', caseId],
    queryFn: () => getVerdict(caseId!),
    enabled: caseId !== undefined,
    staleTime: Infinity, // 판결 내용은 바뀌지 않아서 화면을 오갈 때마다 다시 부르지 않음
  })

// 화면에 보여줄 사건 번호 (예: 제00001호 → 月 제00001호)
export const formatCaseNumber = (caseNumber: string) => `月 ${caseNumber}`
