import arrowBack from "../assets/header/arrow-back.svg";
import arrowBackDark from "../assets/header/arrow-back-dark.svg";
import titleDalpan from "../assets/header/title-dalpan.svg";
import titleJury from "../assets/header/title-jury.svg";
import titleMy from "../assets/header/title-my.svg";
import Button from "./Button";

type MainTitle = "dalpan" | "jury" | "my";

// 헤더 색상 두 개!!: dark(기본, 남색 배경) / light(크림색 배경)
type HeaderTheme = "dark" | "light";

type HeaderProps =
  | { depth: 1; title: MainTitle; onBack?: never; theme?: never }
  | { depth: 2; title: string; onBack: () => void; theme?: HeaderTheme };

const mainTitles = {
  dalpan: { src: titleDalpan, alt: "달판", position: "pl-[28px] pt-[16px]" },
  jury: { src: titleJury, alt: "배심원석", position: "pl-[29px] pt-[14px]" },
  my: { src: titleMy, alt: "마이", position: "pl-[29px] pt-[14px]" },
} satisfies Record<MainTitle, { src: string; alt: string; position: string }>;

function Header(props: HeaderProps) {
  if (props.depth === 1) {
    const title = mainTitles[props.title];

    return (
      <header className={`h-[59px] w-full shrink-0 bg-bg ${title.position}`}>
        <img src={title.src} alt={title.alt} className="block max-w-none" />
      </header>
    );
  }

  const isLight = props.theme === "light";

  return (
    <header className={`relative h-[51px] w-full shrink-0 ${isLight ? "bg-bg-light" : "bg-bg"}`}>
      <Button
        type="button"
        aria-label="뒤로가기"
        onClick={props.onBack}
        className="absolute left-[19px] top-[14px] size-[24px] cursor-pointer"
      >
        {isLight ? (
          <img src={arrowBackDark} alt="" className="block max-w-none" />
        ) : (
          <img
            src={arrowBack}
            alt=""
            className="absolute left-[8.25066px] top-[6.25066px] block max-w-none"
          />
        )}
      </Button>
      <h1 className={`text-b2-regular absolute left-1/2 top-[15px] h-[23px] -translate-x-1/2 whitespace-nowrap ${isLight ? "text-black" : "text-white-100"}`}>
        {props.title}
      </h1>
    </header>
  );
}

export default Header;
