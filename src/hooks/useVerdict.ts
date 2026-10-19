// 판결문 화면 공통: 주소의 사건 ID 꺼내기 + 최종 판결 불러오기

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getVerdict } from '../apis/verdictApi'
import type { Verdict } from '../types/verdict'

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

// 판결 → 판결 요약 카드 · 판결문 이미지에 넣는 값
export const toVerdictSummary = (verdict: Verdict) => ({
  caseNumber: formatCaseNumber(verdict.case_number),
  relation: verdict.relation,
  title: verdict.title,
  myReasons: verdict.self_factors.map((factor) => factor.name), // 한쪽은 빈 배열일 수 있음
  otherReasons: verdict.other_factors.map((factor) => factor.name),
  myRatio: verdict.fault_ratio,
  otherRatio: verdict.other_fault_ratio,
  oneLine: verdict.one_line,
})
