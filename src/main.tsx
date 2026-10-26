import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isAxiosError } from 'axios'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx(권한 없음, 없는 사건 등)는 다시 요청해도 같으므로 재시도 안 함, 그 외는 1번만 재시도
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status && status >= 400 && status < 500) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false, // 다른 탭 갔다 와도 자동으로 다시 불러오지 않음
    },
  },
});

for (const key of ['juryCases', 'myCases', 'featuredCases']) {
  queryClient.setQueryDefaults([key], { staleTime: 30_000, gcTime: 15 * 60_000 })
}
queryClient.setQueryDefaults(['verdict'], { staleTime: 60_000, gcTime: 15 * 60_000 })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
