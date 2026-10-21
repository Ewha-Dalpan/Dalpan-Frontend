// 결제 - 톨 부족 창

import { useNavigate } from 'react-router-dom'
import shortageRabbit from '../../assets/payment/shortage-rabbit.svg'
import Button from '../../components/Button'
import { paths } from '../../routes/paths'

function TollShortagePage() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-98.25 flex-col items-center bg-bg px-6 pb-10 text-white-100">
      {/* 땀 흘리는 토끼  */}
      <div className="relative mt-32.75 h-51 w-[209.574px] overflow-hidden rounded-[110.361px]">
        <img src={shortageRabbit} alt="" className="absolute top-5.25 left-13 block max-w-none" />
      </div>

      <div role="status" className="mt-9.25 flex flex-col items-center gap-2 text-center">
        <h1 className="text-h2-semibold">
          앗....
          <br />
          이용권이 부족해요
        </h1>
        <p className="text-b2-regular text-gray-30">1톨로 판결문을 받아보세요.</p>
      </div>

      {/* 이용권 충전하러 가기 → 이용권 충전 */}
      <Button variant="white" fullWidth onClick={() => navigate(paths.tollCharge)} className="mt-auto">
        이용권 충전하러 가기
      </Button>
    </main>
  )
}

export default TollShortagePage
