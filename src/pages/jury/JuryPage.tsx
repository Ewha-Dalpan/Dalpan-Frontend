import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import romanceParticipants from "../../assets/home/participants.svg";
import participants from "../../assets/jury/participants.svg";
import judgeRabbit from "../../assets/jury/judge-rabbit.svg";
import jurySeats from "../../assets/jury/jury-seats.png";
import romanceBubble from "../../assets/jury/bubble-romance.svg";
import schoolBubble from "../../assets/jury/bubble-school.svg";
import friendBubble from "../../assets/jury/bubble-friend.svg";

type CaseBubbleProps = {
  category: string;
  title: [string, string];
  count: number;
  bubble: string;
  className: string;
  friend?: boolean;
};

function CaseBubble({
  category,
  title,
  count,
  bubble,
  className,
  friend = false,
}: CaseBubbleProps) {
  return (
    <li className={`absolute ${className}`}>
      {/* 그림자가 포함된 원본 말풍선 */}
      <img
        src={bubble}
        alt=""
        className="pointer-events-none absolute -left-[34px] -top-[34px] block max-w-none rotate-180"
      />
      <span
        className={`absolute rounded-[50px] bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100 ${friend ? "text-l1-medium left-[14px] top-[12px]" : "text-l2-medium left-[12px] top-[13px]"}`}
      >
        {category}
      </span>
      <p
        className={`text-b3-medium absolute whitespace-nowrap ${friend ? "left-[15px] top-[44px] text-gray-100" : `${category === "직장/학교" ? "left-[14px]" : "left-[15px]"} top-[42px] text-gray-90`}`}
      >
        {title[0]}
        <br />
        {title[1]}
      </p>
      <div
        className={`absolute flex items-center gap-[2px] ${friend ? "left-[15px] top-[89px]" : `${category === "직장/학교" ? "left-[14px]" : "left-[15px]"} top-[87px]`}`}
      >
        <span className="relative size-[16px] shrink-0">
          <img
            src={category === "연애" ? romanceParticipants : participants}
            alt=""
            className="absolute left-[8.17%] top-[8.33%] block max-w-none"
          />
        </span>
        <span className="text-l2-medium text-gray-50">{count}명 참여</span>
      </div>
    </li>
  );
}

function JuryPage() {
  const navigate = useNavigate();

  return (
    <section
      aria-label="배심원석 안내"
      className="relative min-h-[640px] pt-[3px]"
    >
      <h1 className="text-h4-semibold ml-[26px]">
        다른 사람의 사건을 읽고,
        <br />
        직접 판결에 참여해보세요.
      </h1>
      <img
        src={judgeRabbit}
        alt=""
        className="pointer-events-none absolute right-[35px] -top-[34px] block max-w-none"
      />
      <Button
        type="button"
        onClick={() => navigate(paths.juryExplore)}
        className="text-b2-semibold absolute left-[26px] right-[24px] top-[93px] cursor-pointer rounded-[8px] bg-keycolor-100 px-[10px] py-[8px] text-white-100"
      >
        배심원석 입장
      </Button>

      <div className="relative mt-[103px] h-[480px] overflow-x-clip">
        <div className="absolute left-1/2 top-0 h-full w-[393px] -translate-x-1/2">
          <div className="pointer-events-none absolute left-[-45px] top-[284px] h-[196px] w-[484px] overflow-hidden">
            <img
              src={jurySeats}
              alt=""
              className="absolute left-0 top-[-74.49%] h-[246.94%] w-full max-w-none"
            />
          </div>
          <ul aria-label="배심원 참여 사건 예시">
            <CaseBubble
              category="직장/학교"
              title={["팀플 단톡방에서", "제 의견만 계속 무시돼요."]}
              count={32}
              bubble={schoolBubble}
              className="left-[45px] top-[207px] h-[125px] w-[162px]"
            />
            <CaseBubble
              category="연애"
              title={[
                "약속 당일 4시간 연락이 없었는데,",
                "제가 예민한 건가요?",
              ]}
              count={128}
              bubble={romanceBubble}
              className="left-[39px] top-0 h-[125.375px] w-[204px]"
            />
            <CaseBubble
              category="친구"
              title={["제 생일은 넘어가고", "자기 생일 선물은 챙겨달라는 친구"]}
              count={96}
              bubble={friendBubble}
              friend
              className="left-[162px] top-[113px] h-[128.918px] w-[206px]"
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JuryPage;
