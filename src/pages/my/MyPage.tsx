import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/paths'
import profileRabbit from '../../assets/my/profile-rabbit.png'
import editIcon from '../../assets/my/edit.svg'
import tolIcon from '../../assets/my/tol.svg'

const profile = {
  nickname: '눈치 빠른 달토끼 037',
  caseCount: 4,
  juryCount: 12,
  tolBalance: 18,
}

function MyPage() {
  const navigate = useNavigate()
  return (
    <div className="pt-[7px]">
      <section aria-label="내 프로필" className="ml-[23px] mr-[24px] overflow-hidden rounded-[20px] bg-white-100 text-gray-90">
        <div className="flex h-[146px] flex-col items-center gap-[8px] pl-px pt-[29px]">
          <div className="relative size-[58px] shrink-0 overflow-hidden rounded-full bg-[#ffd95c]">
            <img src={profileRabbit} alt="달토끼 프로필" className="absolute left-[-4.35px] top-[-10.15px] size-[68.15px] max-w-none object-cover" />
          </div>
          <div className="flex items-center gap-[4px]">
            <h1 className="text-h3-medium">{profile.nickname}</h1>
            <Button aria-label="닉네임 수정" aria-disabled="true" className="size-[16px] shrink-0">
              <img src={editIcon} alt="" className="block max-w-none" />
            </Button>
          </div>
        </div>
        <div className="grid h-[83px] grid-cols-2 border-t border-gray-10">
          <Button onClick={() => navigate(paths.myCases)} className="flex cursor-pointer flex-col items-center border-r border-gray-10 pt-[17px]">
            <span className="text-b2-regular translate-x-[2.75px] text-gray-50">내 사건</span>
            <span className="text-b1-semibold translate-x-[2.75px]">{profile.caseCount}건</span>
          </Button>
          <Button onClick={() => navigate(paths.myJuryActivity)} className="flex cursor-pointer flex-col items-center pt-[17px]">
            <span className="text-b2-regular -translate-x-[1.5px] text-gray-50">배심 활동</span>
            <span className="text-b1-semibold -translate-x-[1.5px]">{profile.juryCount}건</span>
          </Button>
        </div>
      </section>

      <section aria-labelledby="tol-heading" className="mt-[23px]">
        <h2 id="tol-heading" className="text-l1-regular ml-[24px]">톨 관리</h2>
        <div className="mt-[9.5px] flex flex-col gap-[2px] text-gray-90">
          <div className="text-b2-medium relative flex h-[46px] items-center bg-white-100 pl-[26px] pt-px">
            <span>보유 톨</span>
            <span className="absolute left-[calc(100%-77px)] top-[12px] flex items-center gap-px">
              <span className="relative size-[21px] overflow-hidden" aria-hidden="true">
                <img src={tolIcon} alt="" className="absolute left-[4.691px] top-[0.431px] block max-w-none rotate-[19.17deg]" />
              </span>
              <span>{profile.tolBalance}톨</span>
            </span>
          </div>
          {['톨 충전하기', '톨 이용 내역'].map((label) => (
            <Button key={label} aria-disabled="true" className="text-b2-medium flex h-[46px] items-center bg-white-100 pl-[26px] pt-px text-left">{label}</Button>
          ))}
        </div>
      </section>

      <section aria-labelledby="settings-heading" className="mt-[28px]">
        <h2 id="settings-heading" className="text-l1-regular ml-[24px]">계정 및 설정</h2>
        <div className="mt-[9.5px] flex flex-col gap-[2px] text-gray-90">
          {['계정 관리', '로그아웃'].map((label) => (
            <Button key={label} aria-disabled="true" className="text-b2-medium flex h-[46px] items-center bg-white-100 pl-[26px] pt-px text-left">{label}</Button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MyPage
