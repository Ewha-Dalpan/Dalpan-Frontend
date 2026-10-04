import { useRef } from "react";
import type { PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import aiJudge from "../../assets/home/ai-judge.svg";
import ground from "../../assets/home/ground.svg";
import participants from "../../assets/home/participants.svg";
import rabbits from "../../assets/home/rabbits.png";
import Button from "../../components/Button";
import { paths } from "../../routes/paths";

// API 연결 전 가아짜 데이터
const featuredCases = [
  {
    id: 1,
    category: "연애",
    title: ["약속 당일 4시간 연락이 없었는데,", "제가 예민한 건가요?"],
    participantCount: 128,
  },
  {
    id: 2,
    category: "친구",
    title: ["제 생일은 넘어가고", "자기 생일 선물은 챙겨달라는 친구"],
    participantCount: 96,
  },
  {
    id: 3,
    category: "직장·학교",
    title: ["팀플 단톡방에서 제 의견만 계속", "무시돼요. 제가 예민한 걸까요?"],
    participantCount: 32,
  },
  {
    id: 4,
    category: "가족",
    title: ["부모님이 제 진로 얘기만 나오면", "비교하세요."],
    participantCount: 71,
  },
];

function HomePage() {
  const navigate = useNavigate();
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);

  // 터치는 기본 스와이프, 마우스는 드래그로 이동!!
  function startDrag(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    dragStart.current = {
      x: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLUListElement>) {
    if (!dragStart.current) return;
    event.currentTarget.scrollLeft =
      dragStart.current.scrollLeft + dragStart.current.x - event.clientX;
  }

  function endDrag(event: PointerEvent<HTMLUListElement>) {
    dragStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="relative isolate min-h-[max(733px,calc(100dvh-59px))] overflow-hidden pt-[17px]">
      <img
        src={ground}
        alt=""
        className="pointer-events-none absolute left-[calc(50%+0.5px)] top-[466px] -z-10 block max-w-none -translate-x-1/2"
      />
      <img
        src={rabbits}
        alt=""
        className="pointer-events-none absolute left-[calc(50%-190.5px)] top-[406px] -z-10 h-[210px] w-[375px] max-w-none object-cover"
      />

      <section
        aria-labelledby="ai-judgment-title"
        className="relative mx-[24px] h-[177px] rounded-[20px] bg-white-100 pt-[23px]"
      >
        <div className="ml-[22px] mr-[15px]">
          <div className="flex items-center gap-[6px]">
            <img src={aiJudge} alt="" className="block shrink-0 max-w-none" />
            <h1
              id="ai-judgment-title"
              className="text-h4-semibold text-gray-90"
            >
              AI 판결 받기
            </h1>
          </div>
          <p className="text-b2-regular mt-[8px] text-gray-70">
            이 대화, 내가 예민한 걸까?
            <br />
            상황을 읽고 애매했던 대화를 판단해드려요.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(paths.upload)}
          className="absolute inset-x-0 top-[117px] ml-[16px] mr-[15px]"
        >
          대화 캡처로 바로 판결받기
        </Button>
      </section>

      <section aria-labelledby="featured-cases-title" className="mt-[21px]">
        <h2
          id="featured-cases-title"
          className="text-b2-medium ml-[24px] h-[23px]"
        >
          지금 주목받는 사건
        </h2>
        <ul
          tabIndex={0}
          aria-labelledby="featured-cases-title"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={() => {
            dragStart.current = null;
          }}
          onDragStart={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            event.currentTarget.scrollBy({
              left: event.key === "ArrowRight" ? 240 : -240,
            });
          }}
          className="mt-[10px] flex cursor-grab select-none gap-[8px] overflow-x-auto overscroll-x-contain px-[24px] active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredCases.map((item) => (
            <li
              key={item.id}
              className="relative h-[137px] w-[232px] shrink-0 rounded-[20px] bg-white-100"
            >
              <span className="text-l1-medium absolute left-[15px] top-[17px] rounded-[50px] bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">
                {item.category}
              </span>
              <h3 className="text-b2-medium absolute left-[18px] top-[49px] whitespace-nowrap text-gray-90">
                {item.title[0]}
                <br />
                {item.title[1]}
              </h3>
              <div className="absolute left-[18px] top-[102px] flex items-center gap-[2px]">
                <span className="relative size-[16px] shrink-0">
                  <img
                    src={participants}
                    alt=""
                    className="absolute left-[8.17%] top-[8.33%] block max-w-none"
                  />
                </span>
                <span className="text-l1-medium text-gray-50">
                  {item.participantCount}명 참여
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
