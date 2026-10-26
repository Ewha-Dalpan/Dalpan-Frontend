// 톨 아이콘

import tolLarge from '../assets/payment/tol-large.svg'
import tolSmall from '../assets/my/tol.svg'

const SIZES = {
  sm: { src: tolSmall, box: 'h-[21.255px] w-[17.207px]' },
  lg: { src: tolLarge, box: 'h-[28.011px] w-[22.676px]' },
}

function TollIcon({ size = 'sm' }: { size?: keyof typeof SIZES }) {
  const { src, box } = SIZES[size]
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center ${box}`}>
      <img src={src} alt="" className="block max-w-none rotate-[19.17deg]" />
    </span>
  )
}

export default TollIcon
