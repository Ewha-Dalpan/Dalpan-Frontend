import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Button from '../../components/Button'
import { paths } from '../../routes/paths'
import { getApiErrorMessage, isApiStatus } from '../../utils/apiError'

export default function JuryCaseStatus({ error, retry }: { error?: unknown; retry?: () => void }) {
  const navigate = useNavigate()
  return <div className="min-h-dvh bg-white-100">
    <Header depth={2} theme="white" title="배심원석" onBack={() => navigate(paths.juryExplore)} />
    <div className="p-6" role={error ? 'alert' : 'status'}>
      <p>{error ? isApiStatus(error, 404) ? '공개된 사건을 찾을 수 없어요.' : getApiErrorMessage(error) : '사건을 불러오는 중이에요.'}</p>
      {Boolean(error) && retry && <Button className="mt-4" onClick={retry}>다시 시도</Button>}
    </div>
  </div>
}
