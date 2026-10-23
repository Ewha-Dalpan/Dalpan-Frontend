import Button from "../../components/Button";
import { useQuery } from "@tanstack/react-query";
import { getRandomCases } from "../../apis/featuredCasesApi";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import romanceParticipants from "../../assets/home/participants.svg";
import participants from "../../assets/jury/participants.svg";
import judgeRabbit from "../../assets/jury/judge-rabbit.svg";
import jurySeats from "../../assets/jury/jury-seats.png";
import romanceBubble from "../../assets/jury/bubble-romance.svg";
import friendBubble from "../../assets/jury/bubble-friend.svg";

type CaseBubbleProps = {
  category: string;
  title: string;
  caseId: number;
  count: number;
  bubble: string;
  className: string;
  friend?: boolean;
};

function CaseBubble({
  category,
  caseId,
  title,
  count,
  bubble,
  className,
  friend = false,
}: CaseBubbleProps) {
  return (
    <li className={`relative w-[230px] max-w-[calc(100%-48px)] shrink-0 not-first:-mt-[8px] ${className}`}>
      <Link to={paths.juryParticipate(caseId)} aria-label={title} className="relative block min-h-[129px] rounded-[20px] px-[15px] pt-[13px] pb-[22px] focus-visible:outline-2 focus-visible:outline-keycolor-40">
      <img
        src={bubble}
        alt=""
        className="pointer-events-none absolute -left-[34px] -top-[34px] h-[calc(100%+68px)] w-[calc(100%+68px)] max-w-none rotate-180"
      />
      <span className={`relative inline-block rounded-[50px] bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100 ${friend ? 'text-l1-medium' : 'text-l2-medium'}`}>
        {category}
      </span>
      <p className="text-b3-medium relative mt-[3px] break-words text-gray-90">
        {title}
      </p>
      <div className="relative mt-[3px] flex items-center gap-[2px]">
        <span className="relative size-[16px] shrink-0">
          <img
            src={category === "연애" ? romanceParticipants : participants}
            alt=""
            className="absolute left-[8.17%] top-[8.33%] block max-w-none"
          />
        </span>
        <span className="text-l2-medium text-gray-50">{count}명 참여</span>
      </div>
      </Link>
    </li>
  );
}

function JuryPage() {
  const navigate = useNavigate();
  const randomCases = useQuery({
    queryKey: ['featuredCases', 'random'],
    queryFn: getRandomCases,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
  const slots = [
    { bubble: romanceBubble, className: 'ml-[39px]' },
    { bubble: friendBubble, className: 'mr-[25px] self-end', friend: true },
    { bubble: romanceBubble, className: 'ml-[45px]' },
  ];

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

      <div className="relative mt-[103px] min-h-[480px] overflow-x-clip">
        <div className="relative mx-auto w-full max-w-[393px]">
          <ul aria-label="무작위 배심 참여 사건" className="relative z-10 flex flex-col">
            {randomCases.data?.map((item, index) => <CaseBubble
              key={item.case_id}
              caseId={item.case_id}
              category={item.relation}
              title={item.title}
              count={item.jury_count}
              {...slots[index]}
            />)}
          </ul>
          {randomCases.isPending && <p role="status" className="text-b2-regular mx-6 py-4">사건을 불러오는 중이에요.</p>}
          {randomCases.isError && <div role="alert" className="text-b2-regular mx-6 py-4">
            <p>사건을 불러오지 못했어요.</p>
            <Button onClick={() => void randomCases.refetch()} className="mt-2 underline">다시 시도</Button>
          </div>}
          {randomCases.isSuccess && randomCases.data.length === 0 && <p role="status" className="text-b2-regular mx-6 py-4">아직 공개된 사건이 없어요.</p>}
          <div className="pointer-events-none relative -mt-[48px] h-[196px] w-full overflow-hidden">
            <img
              src={jurySeats}
              alt=""
              className="absolute left-1/2 top-[-74.49%] h-[246.94%] w-[484px] max-w-none -translate-x-1/2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default JuryPage;
