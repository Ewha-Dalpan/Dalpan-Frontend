import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Toast from '../../components/Toast'
import Textarea from '../../components/Textarea'
import { useToast } from '../../hooks/useToast'
import { paths } from '../../routes/paths'
import { exampleJuryCases } from './exampleJuryCases'
import JuryCaseContent from './JuryCaseContent'
import avatar1 from '../../assets/jury/detail/avatar1.png'
import avatar2 from '../../assets/jury/detail/avatar2.png'
import avatar3 from '../../assets/jury/detail/avatar3.png'
import avatar4 from '../../assets/jury/detail/avatar4.png'
import me from '../../assets/jury/detail/me.png'
import more from '../../assets/jury/detail/more.svg'
import people from '../../assets/jury/detail/people.svg'
import colon from '../../assets/jury/detail/colon.svg'
import commentIcon from '../../assets/jury/detail/comment.svg'
import send from '../../assets/jury/detail/send.svg'

const initialComments = [
  { name: '태평한 달토끼 012', time: '1일 전', avatar: avatar1, color: '#ffd95c', text: '상대가 너무 무심했던 것 같아요.\n최소한 약속 전에 한 번은 연락했어야 해요.' },
  { name: '수상한 달토끼 042', time: '5시간 전', avatar: avatar2, color: '#5cc0ff', text: '서운할 수는 있지만, 큰 잘못까지는 아니라는 생각도 들어요.' },
  { name: '똑부러진 달토끼 007', time: '3시간 전', avatar: avatar3, color: '#ffd95c', text: '문제는 4시간 자체보다 상대가 기다리고 있을 걸 알면서 아무 설명이 없었다는 점 같아요.' },
  { name: '걱정하는 달토끼 211', time: '1시간 전', avatar: avatar4, color: '#ff875c', text: '연애에서는 연락 자체가 약속의 일부처럼 느껴질 수 있어서 작성자의 감정도 이해돼요.' },
]

function RatioRow({ left, right }: { left: number; right: number }) {
  return <>
    <div className="mx-[17px] flex h-[11px] overflow-hidden rounded-[8px] bg-keycolor-20"><div className="h-full rounded-[8px] bg-keycolor-70" style={{ width: `${left / (left + right) * 100}%` }} /></div>
    <div className="mt-[7px] flex items-center justify-center gap-[6px]">
      {['상대방', '사연자'].map((label, i) => <div key={label} className="contents">{i === 1 && <img src={colon} alt=":" />}<span className="text-l2-regular flex gap-[2px] rounded-[8px] bg-white-100 px-[8px] py-[4px] text-gray-50">{label}<strong className="font-medium text-gray-80">{i === 0 ? left : right}</strong></span></div>)}
    </div>
  </>
}

function Detail({ item }: { item: (typeof exampleJuryCases)[number] }) {
  const navigate = useNavigate()
  const location = useLocation()
  const submitted = location.state?.ratio
  const ratio = typeof submitted === 'number' && Number.isFinite(submitted) ? Math.max(0, Math.min(100, Math.round(submitted))) : null
  const [comments, setComments] = useState(item.id === 1 ? initialComments : [])
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const { toast, showToast, hideToast } = useToast()
  const addedCount = comments.length - (item.id === 1 ? initialComments.length : 0)
  return <div className="mx-auto min-h-dvh max-w-[393px] bg-white-100 text-gray-90">
    <Header depth={2} theme="white" title="배심원석" onBack={() => navigate(paths.juryExplore, { replace: true })} />
    <main className="pt-[5px]">
      <JuryCaseContent item={item} />
      <section aria-label="판결 결과" className="mx-[18px] mt-[18px] h-[180px] rounded-[8px] bg-gray-5 pt-[19px]">
        <div className="mb-[9px] flex items-center justify-between px-[14px] text-l2-regular"><h2>전체 배심원 판결</h2><span className="flex items-center gap-[2px] text-gray-50"><img src={people} alt="" />{item.participants}명 참여</span></div>
        <RatioRow left={72} right={27} />
        <h2 className="text-l2-regular mb-[4px] mt-[8px] px-[14px]">내가 제출한 판결</h2>
        {ratio === null ? <p className="text-l2-regular px-[14px] text-gray-50">제출한 판결이 없습니다.</p> : <RatioRow left={ratio} right={100 - ratio} />}
      </section>
      <section aria-label="댓글" className="mx-[19px] mt-[18px]">
        <h2 className="text-l1-medium mb-[6px] flex items-center gap-[2px] text-gray-40"><img src={commentIcon} alt="" />댓글 수 {item.comments + addedCount}</h2>
        <div className="flex flex-col gap-[16px] border-t border-gray-10 px-[5px] pb-[19px] pt-[16px]">
          {comments.map((comment, index) => <article key={index}>
            <div className="mb-[4px] flex items-center justify-between"><div className="flex items-center gap-[4px]"><img src={comment.avatar} alt="" className="size-[24px] rounded-full object-cover" style={{ backgroundColor: comment.color }} /><span className="text-l1-regular">{comment.name}</span><span className="text-l2-regular text-gray-50">{comment.time}</span></div><button type="button" aria-label={`${comment.name} 댓글 메뉴`} onClick={() => showToast('댓글 메뉴는 준비 중이에요.')}><img src={more} alt="" /></button></div>
            <p className="text-b2-regular w-[334px] max-w-full whitespace-pre-line break-words">{comment.text}</p>
          </article>)}
        </div>
      </section>
    </main>
    <form className="sticky bottom-0 bg-gray-5 px-[24px] pb-[16px] pt-[10px]" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setComments([...comments, { name: '눈치 빠른 달토끼 037', time: '방금 전', avatar: me, color: '#ffd95c', text: draft.trim() }]); setDraft(''); setEditing(false) }}>
      {editing && <div className="mb-[8px] flex w-fit items-center gap-[4px] rounded-full bg-keycolor-20 px-[8px] py-[4px] text-l2-regular text-keycolor-70"><img src={me} alt="" className="size-[16px] rounded-full bg-[#ffd95c]" />눈치 빠른 달토끼 037</div>}
      <div className="relative"><Textarea aria-label="댓글 달기" value={draft} onFocus={() => setEditing(true)} onChange={(event) => setDraft(event.target.value)} placeholder="댓글 달기" className="min-h-[42px] max-h-[180px] overflow-y-auto placeholder:text-gray-40" style={{ padding: '9px 44px 9px 17px', fontSize: 15, fontWeight: 400, lineHeight: '24px' }} />{editing && <Button type="submit" disabled={!draft.trim()} aria-label="댓글 전송" className="absolute right-[5px] bottom-[5px] flex size-[32px] items-center justify-center rounded-[8px] bg-keycolor-100 disabled:opacity-40"><img src={send} alt="" /></Button>}</div>
    </form>
    <Toast toast={toast} onHide={hideToast} />
  </div>
}

export default function JuryDetailPage() {
  const { caseId } = useParams()
  const item = exampleJuryCases.find((entry) => String(entry.id) === caseId)
  return item ? <Detail key={item.id} item={item} /> : <Navigate to={paths.juryExplore} replace />
}
