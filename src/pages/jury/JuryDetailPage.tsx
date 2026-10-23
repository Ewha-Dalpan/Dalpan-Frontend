import JuryReportDialog from './JuryReportDialog'
import JuryCaseReportButton from './JuryCaseReportButton'
import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Toast from '../../components/Toast'
import Textarea from '../../components/Textarea'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getJuryComments, createJuryComment, deleteJuryComment } from '../../apis/juryApi'
import type { JuryCaseDetail } from '../../types/jury'
import { getApiErrorMessage } from '../../utils/apiError'
import { useAuthStore } from '../../store/useAuthStore'
import Modal from '../../components/modal/Modal'
import { useJuryCase } from './useJuryCase'
import JuryCaseStatus from './JuryCaseStatus'
import JuryCaseContent from './JuryCaseContent'
import avatar1 from '../../assets/jury/detail/avatar1.png'
import me from '../../assets/jury/detail/me.png'
import JuryActionMenu from './JuryActionMenu'
import people from '../../assets/jury/detail/people.svg'
import colon from '../../assets/jury/detail/colon.svg'
import commentIcon from '../../assets/jury/detail/comment.svg'
import send from '../../assets/jury/detail/send.svg'

function RatioRow({ left, right }: { left: number; right: number }) {
  return <>
    <div className="mx-[17px] flex h-[11px] overflow-hidden rounded-[8px] bg-keycolor-20"><div className="h-full rounded-[8px] bg-keycolor-70" style={{ width: `${left / (left + right) * 100}%` }} /></div>
    <div className="mt-[7px] flex items-center justify-center gap-[6px]">
      {['상대방', '사연자'].map((label, i) => <div key={label} className="contents">{i === 1 && <img src={colon} alt=":" />}<span className="text-l2-regular flex gap-[2px] rounded-[8px] bg-white-100 px-[8px] py-[4px] text-gray-50">{label}<strong className="font-medium text-gray-80">{i === 0 ? left : right}</strong></span></div>)}
    </div>
  </>
}

function Detail({ item }: { item: JuryCaseDetail }) {
  const navigate = useNavigate()
  const location = useLocation()
  const client = useQueryClient()
  const nickname = useAuthStore((state) => state.nickname)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const [reporting, setReporting] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const { toast, showToast, hideToast } = useToast()
  const query = useInfiniteQuery({
    queryKey: ['juryComments', item.case_id],
    queryFn: ({ pageParam }) => getJuryComments(item.case_id, pageParam),
    initialPageParam: 1,
    getNextPageParam: (page, _pages, pageParam) => page.next ? pageParam + 1 : undefined,
  })
  const comments = [...new Map((query.data?.pages.flatMap((page) => page.results) ?? []).map((entry) => [entry.id, entry])).values()]
  const mutateComment = async (deleteId?: number) => {
    if (pending.current || (!deleteId && (!draft.trim() || draft.trim().length > 1000))) return
    pending.current = true
    setBusy(true)
    try {
      if (deleteId) await deleteJuryComment(item.case_id, deleteId)
      else { await createJuryComment(item.case_id, draft.trim()); setDraft(''); setEditing(false) }
      setDeleting(null)
      await Promise.all([
        client.invalidateQueries({ queryKey: ['juryComments', item.case_id] }),
        client.invalidateQueries({ queryKey: ['juryCase', item.case_id] }),
        client.invalidateQueries({ queryKey: ['juryCases'] }),
      ])
    } catch (error) { showToast(getApiErrorMessage(error)) }
    finally { pending.current = false; setBusy(false) }
  }
  return <div className="mx-auto min-h-dvh max-w-[393px] bg-white-100 text-gray-90">
    <div className="relative"><Header depth={2} theme="white" title="배심원석" onBack={() => navigate(paths.juryExplore, { replace: true })} /><JuryCaseReportButton caseId={item.case_id} isAuthor={item.is_author} /></div>
    <main className="pt-[5px]">
      <JuryCaseContent item={item} />
      <section aria-label="판결 결과" className="mx-[18px] mt-[18px] h-[180px] rounded-[8px] bg-gray-5 pt-[19px]">
        <div className="mb-[9px] flex items-center justify-between px-[14px] text-l2-regular"><h2>전체 배심원 판결</h2><span className="flex items-center gap-[2px] text-gray-50"><img src={people} alt="" />{item.jury_count}명 참여</span></div>
        {item.result ? <RatioRow left={item.result.other} right={item.result.author} /> : <p className="px-[14px] text-l2-regular text-gray-50">아직 제출된 판결이 없습니다.</p>}
        <h2 className="text-l2-regular mb-[4px] mt-[8px] px-[14px]">내가 제출한 판결</h2>
        {item.my_vote === null ? <p className="text-l2-regular px-[14px] text-gray-50">제출한 판결이 없습니다.</p> : <RatioRow left={item.my_vote.other} right={item.my_vote.author} />}
      </section>
      <section aria-label="댓글" className="mx-[19px] mt-[18px]">
        <h2 className="text-l1-medium mb-[6px] flex items-center gap-[2px] text-gray-40"><img src={commentIcon} alt="" />댓글 수 {query.data?.pages[0]?.count ?? item.comment_count}</h2>
        <div className="flex flex-col gap-[16px] border-t border-gray-10 px-[5px] pb-[19px] pt-[16px]">
          {query.isPending && <p role="status">댓글을 불러오는 중이에요.</p>}
          {query.isError && <Button onClick={() => void query.refetch()}>댓글을 불러오지 못했어요. 다시 시도</Button>}
          {query.isSuccess && !comments.length && <p className="text-b2-regular text-gray-50">첫 댓글을 남겨보세요.</p>}
          {comments.map((comment) => <article key={comment.id}>
            <div className="mb-[4px] flex items-center justify-between"><div className="flex items-center gap-[4px]"><img src={comment.is_mine ? me : avatar1} alt="" className="size-[24px] rounded-full object-cover"  /><span className="text-l1-regular">{comment.nickname}</span><span className="text-l2-regular text-gray-50">{new Date(comment.created_at).toLocaleDateString('ko-KR')}</span></div><JuryActionMenu label={`${comment.nickname} 댓글 메뉴`} actionLabel={comment.is_mine ? '댓글 삭제' : '신고'} onAction={() => comment.is_mine ? setDeleting(comment.id) : setReporting(comment.id)} /></div>
            <p className="text-b2-regular w-[334px] max-w-full whitespace-pre-line break-words">{comment.content}</p>
          </article>)}
        </div>
        {query.hasNextPage && <Button disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()} className="mb-4 w-full">{query.isFetchingNextPage ? '불러오는 중…' : '댓글 더 보기'}</Button>}
      </section>
    </main>
    <form className="sticky bottom-0 bg-gray-5 px-[24px] pb-[16px] pt-[10px]" onSubmit={(event) => { event.preventDefault(); void mutateComment() }}>
      {editing && <div className="mb-[8px] flex w-fit items-center gap-[4px] rounded-full bg-keycolor-20 px-[8px] py-[4px] text-l2-regular text-keycolor-70"><img src={me} alt="" className="size-[16px] rounded-full bg-[#ffd95c]" />{nickname}</div>}
      <div className="relative"><Textarea disabled={busy} maxLength={1000} aria-label="댓글 달기" value={draft} onFocus={() => setEditing(true)} onChange={(event) => setDraft(event.target.value)} placeholder="댓글 달기" className="min-h-[42px] max-h-[180px] overflow-y-auto placeholder:text-gray-40" style={{ padding: '9px 44px 9px 17px', fontSize: 15, fontWeight: 400, lineHeight: '24px' }} />{editing && <Button type="submit" disabled={busy || !draft.trim()} aria-label="댓글 전송" className="absolute right-[5px] bottom-[5px] flex size-[32px] items-center justify-center rounded-[8px] bg-keycolor-100 disabled:opacity-40"><img src={send} alt="" /></Button>}</div>
    </form>
    {reporting !== null && <JuryReportDialog caseId={item.case_id} commentId={reporting} onClose={() => setReporting(null)} onComplete={(message) => { setReporting(null); showToast(message) }} />}
    <Modal open={deleting !== null} title="댓글을 삭제할까요?" cancelText="취소" confirmText={busy ? '삭제 중…' : '삭제'} onCancel={() => { if (!busy) setDeleting(null) }} onConfirm={() => { if (deleting !== null) void mutateComment(deleting) }} />
    <Toast toast={toast ?? (typeof location.state?.toast === 'string' ? { id: location.key, message: location.state.toast } : null)} onHide={() => { hideToast(); navigate(location.pathname, { replace: true, state: null }) }} />
  </div>
}

export default function JuryDetailPage() {
  const query = useJuryCase()
  if (!query.valid) return <Navigate to={paths.juryExplore} replace />
  if (!query.data) return <JuryCaseStatus error={query.error} retry={() => void query.refetch()} />
  if (!query.data.can_view_result) return <Navigate to={paths.juryParticipate(query.data.case_id)} replace />
  return <Detail key={query.data.case_id} item={query.data} />
}
