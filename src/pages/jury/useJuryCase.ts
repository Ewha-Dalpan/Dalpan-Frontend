import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getJuryCase } from '../../apis/juryApi'
import { useAuthStore } from '../../store/useAuthStore'
import { isApiStatus } from '../../utils/apiError'

export function useJuryCase() {
  const { caseId } = useParams()
  const id = Number(caseId)
  const loggedIn = useAuthStore((state) => Boolean(state.accessToken))
  const valid = Number.isSafeInteger(id) && id > 0
  const query = useQuery({
    queryKey: ['juryCase', id, loggedIn],
    queryFn: () => getJuryCase(id),
    enabled: valid,
    retry: (count, error) => !isApiStatus(error, 404) && !isApiStatus(error, 401) && count < 1,
  })
  return { ...query, valid, loggedIn }
}
