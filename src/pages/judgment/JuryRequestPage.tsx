import { useId, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCase, getCaseImage, resetPublicCaseImage, uploadPublicCaseImage } from '../../apis/caseApi'
import { getVerdict, publishVerdict } from '../../apis/verdictApi'
import type { Case } from '../../types/case'
import type { Verdict } from '../../types/verdict'
import editIcon from '../../assets/jury-request/edit.svg'
import Button from '../../components/Button'
import Header from '../../components/Header'
import MosaicEditor from '../../components/modal/MosaicEditor'
import Modal from '../../components/modal/Modal'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'
import { useCaseIdParam } from '../../hooks/useVerdict'
import { usePublicCaseImages } from '../../hooks/usePublicCaseImages'
import { useGoBack } from '../../hooks/useGoBack'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { paths } from '../../routes/paths'
import { getApiErrorMessage, isApiStatus } from '../../utils/apiError'
import { savePublicCase } from '../../utils/publishCase'

const CAPTURE_STEP = 246

function JuryRequestPage() {
  const caseId = useCaseIdParam()
  const query = useQuery({
    queryKey: ['juryPublication', caseId],
    queryFn: async () => {
      const [item, verdict] = await Promise.all([getCase(caseId!), getVerdict(caseId!)])
      return { item, verdict }
    },
    enabled: caseId !== undefined,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (count, error) => !isApiStatus(error, 404) && count < 2,
  })
  if (caseId === undefined) return <Navigate to={paths.myCases} replace />
  if (query.isPending) return <p role="status" className="p-6 text-center">사건을 불러오는 중이에요.</p>
  if (query.isError) return <div role="alert" className="p-6 text-center"><p>{getApiErrorMessage(query.error)}</p><Button onClick={() => void query.refetch()}>다시 시도</Button></div>
  return <JuryRequestForm key={caseId} item={query.data.item} verdict={query.data.verdict} />
}

function JuryRequestForm({ item, verdict }: { item: Case; verdict: Verdict }) {
  const navigate = useNavigate()
  const goBack = useGoBack(paths.myCases)
  const queryClient = useQueryClient()
  const scrollHandlers = useHorizontalScroll(CAPTURE_STEP)
  const previewTitleId = useId()
  const images = usePublicCaseImages(item.id, item.images)
  const { captures } = images
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [resetId, setResetId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  const { toast, showToast, hideToast } = useToast()
  const preview = verdict.public_preview
  const canPublish = item.status === 'JUDGED' && Boolean(preview.title?.trim() && preview.case_summary?.trim())

  const handleSaveEdit = async (editedSrc: string) => {
    if (editingIndex === null || lock.current) { URL.revokeObjectURL(editedSrc); return }
    lock.current = true
    setBusy(true)
    try {
      const blob = await (await fetch(editedSrc)).blob()
      if (blob.size > 5 * 1024 * 1024) throw new Error('이미지가 5MiB를 넘어요. 더 작은 이미지로 편집해 주세요.')
      const bitmap = await createImageBitmap(blob)
      const pixels = bitmap.width * bitmap.height
      bitmap.close()
      if (pixels > 20_000_000) throw new Error('이미지 해상도는 2천만 픽셀 이하여야 해요.')
      images.replace(captures[editingIndex].id, blob, 'upload')
      setEditingIndex(null)
    } catch (error) {
      showToast(error instanceof Error ? error.message : '편집 이미지를 확인하지 못했어요.')
    } finally {
      URL.revokeObjectURL(editedSrc)
      lock.current = false
      setBusy(false)
    }
  }

  const handleReset = async () => {
    if (resetId === null || lock.current) return
    lock.current = true
    setBusy(true)
    try {
      images.replace(resetId, await getCaseImage(item.id, resetId), 'reset')
      setResetId(null)
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  const handleSubmit = async () => {
    if (lock.current || !images.ready || !canPublish) return
    lock.current = true
    setBusy(true)
    try {
      await savePublicCase(item.id, captures, { upload: uploadPublicCaseImage, reset: resetPublicCaseImage, publish: publishVerdict })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['verdict', item.id] }),
        queryClient.invalidateQueries({ queryKey: ['myCases'] }),
        queryClient.invalidateQueries({ queryKey: ['juryCases'] }),
        queryClient.invalidateQueries({ queryKey: ['featuredCases'] }),
      ])
      navigate(paths.jury, { replace: true, state: { toast: verdict.is_public ? '공개 이미지를 저장했어요.' : '배심원석에 사건을 올렸어요.' } })
    } catch (error) {
      showToast(getApiErrorMessage(error, error instanceof Error ? error.message : '저장하지 못했어요. 다시 시도해 주세요.'))
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col bg-white-100 pb-8.5">
      <Header depth={2} theme="white" title="배심원석 등록" onBack={() => { if (!lock.current) goBack() }} />

      <main className="flex flex-1 flex-col pt-2.75">
        <h2 className="text-h3-semibold px-6 text-gray-90">
          이 사건,
          <br />
          다른사람들은 어떻게 판단할까요?
        </h2>
        <section aria-labelledby={previewTitleId} className="mt-3.5">
          <h3 id={previewTitleId} className="text-b2-medium px-6 text-gray-70">
            배심원들에게 이렇게 보여요
          </h3>
          <div className="mt-3.5 bg-[#f9f9f9] pt-6.5 pb-5.25">
            <p className="text-l2-regular text-center text-gray-30">{new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(item.created_at))}</p>
            <div className="mt-2.25 flex flex-col items-center gap-0.5">
              <span className="text-l1-medium rounded-full bg-keycolor-5 px-2 py-1 text-keycolor-100">{preview.relation}</span>
              <p className="text-h3-semibold px-6 text-center text-gray-90">{preview.title}</p>
            </div>
            {images.error ? <div role="alert" className="p-6 text-center"><p>공개 이미지를 불러오지 못했어요.</p><Button onClick={images.retry}>다시 시도</Button></div> : !images.ready && <p role="status" className="p-6 text-center">{item.images.length ? '이미지를 불러오는 중이에요.' : '공개할 이미지가 없어요.'}</p>}
            <ul
              tabIndex={0}
              aria-label="대화 캡처 (좌우로 넘겨보기)"
              {...scrollHandlers}
              className="scrollbar-none mt-5.5 flex cursor-grab gap-1 overflow-x-auto overscroll-x-contain px-7.75 select-none focus-visible:outline-2 focus-visible:outline-keycolor-40 active:cursor-grabbing"
            >
              {captures.map((capture, index) => (
                <li key={capture.id} className="relative size-60.5 shrink-0 overflow-hidden rounded-[17.224px] bg-gray-10">
                  <div className="size-full overflow-hidden">
                    <img src={capture.src} alt={`대화 캡처 ${index + 1}`} draggable={false} className="size-full object-cover object-top" />
                  </div>
                  <Button aria-label={`대화 캡처 ${index + 1} 가리기`} disabled={busy} onClick={() => setEditingIndex(index)} className="absolute right-2.75 bottom-3 cursor-pointer">
                    <img src={editIcon} alt="" draggable={false} className="block max-w-none" />
                  </Button>
                  {(capture.hasPublicImage || capture.action === 'upload') && capture.action !== 'reset' && <Button disabled={busy} onClick={() => setResetId(capture.id)} className="text-l2-medium absolute bottom-3 left-2 rounded bg-white-100 px-2 py-1">원본으로 되돌리기</Button>}
                </li>
              ))}
            </ul>

            <p className="text-l1-regular mx-auto mt-9.75 w-58.75 text-center text-gray-50">
              AI가 내린 판결과 과실 비율은 공개되지 않아요. 배심원들은 사건 내용만 보고 직접 판단합니다.
            </p>
          </div>
        </section>

        <div className="mt-auto px-6 pt-6">
          <p className="text-l1-regular text-center text-gray-50">무료 · 올린 사건은 마이페이지에서 언제든 내릴 수 있어요</p>
          {verdict.is_public && <p className="text-l1-regular mt-2 text-center text-gray-50">이미 공개 중인 사건이에요. 저장 중 일부 이미지부터 바로 반영될 수 있어요.</p>}
          {!canPublish && <p role="alert" className="text-l1-regular mt-2 text-center">판결이 완료되고 공개용 제목과 요약이 있어야 등록할 수 있어요.</p>}
          <Button variant="primary" fullWidth disabled={busy || !images.ready || !canPublish} onClick={handleSubmit} className="mt-2.5 h-10">
            {busy ? '저장 중…' : verdict.is_public ? '공개 이미지 저장하기' : '배심원석에 올리기'}
          </Button>
        </div>
      </main>
      {editingIndex !== null && captures[editingIndex] && (
        <MosaicEditor key={editingIndex} src={captures[editingIndex].src} onCancel={() => { if (!lock.current) setEditingIndex(null) }} onSave={handleSaveEdit} />
      )}
      <Modal open={resetId !== null} title="원본으로 되돌릴까요?" description="가렸던 내용이 다시 보여요. 저장하면 원본이 배심원석에 공개됩니다." cancelText="취소" confirmText={busy ? '불러오는 중…' : '원본 보기'} onCancel={() => { if (!lock.current) setResetId(null) }} onConfirm={() => void handleReset()} />
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}

export default JuryRequestPage
