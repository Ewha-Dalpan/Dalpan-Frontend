import arrowBack from "../assets/header/arrow-back.svg";
import arrowBackDark from "../assets/header/arrow-back-dark.svg";
import closeIcon from "../assets/header/close.svg";
import titleDalpan from "../assets/header/title-dalpan.svg";
import titleJury from "../assets/header/title-jury.svg";
import titleMy from "../assets/header/title-my.svg";
import Button from "./Button";

type MainTitle = "dalpan" | "jury" | "my";

// 헤더 색상: dark(기본, 남색 배경) / light(크림색 배경) / white(흰 배경)
// light·white는 글자와 뒤로가기 아이콘이 어두운 색
type HeaderTheme = "dark" | "light" | "white";

const themeBackgrounds = { dark: "bg-bg", light: "bg-bg-light", white: "bg-white-100" } satisfies Record<HeaderTheme, string>;

type HeaderProps =
  | { depth: 1; title: MainTitle; onBack?: never; onClose?: never; theme?: never }
  // onBack을 안 넘기면 뒤로가기 버튼 없이 제목만 표시
  // onClose를 넘기면 오른쪽에 X 버튼 표시 (흰색 아이콘이라 dark 테마에서만!)
  | { depth: 2; title: string; onBack?: () => void; onClose?: () => void; theme?: HeaderTheme };

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

  const theme = props.theme ?? "dark";
  const isLight = theme !== "dark";

  return (
    <header className={`relative h-[51px] w-full shrink-0 ${themeBackgrounds[theme]}`}>
      {props.onBack && (
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
      )}
      <h1 className={`text-b2-regular absolute left-1/2 top-[15px] h-[23px] -translate-x-1/2 whitespace-nowrap ${isLight ? "text-black" : "text-white-100"}`}>
        {props.title}
      </h1>
      {props.onClose && (
        <Button
          type="button"
          aria-label="닫기"
          onClick={props.onClose}
          className="absolute right-5.75 top-3.5 size-6 cursor-pointer"
        >
          <img src={closeIcon} alt="" className="block max-w-none" />
        </Button>
      )}
    </header>
  );
}

export default Header;
