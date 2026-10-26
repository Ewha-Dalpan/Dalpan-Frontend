import { useQuery } from '@tanstack/react-query';
import { Link, useOutletContext } from "react-router-dom";
import { getPopularCases } from '../../apis/featuredCasesApi';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import { paths } from '../../routes/paths';
import aiJudge from "../../assets/home/ai-judge.svg";
import ground from "../../assets/home/ground.svg";
import participants from "../../assets/home/participants.svg";
import rabbitHome from "../../assets/home/rabbit-home.mp4";
import Button from "../../components/Button";
import type { MainLayoutContext } from "../../layouts/MainLayout";

function HomePage() {
  const { startJudgment } = useOutletContext<MainLayoutContext>();
  const scroll = useHorizontalScroll(240);
  const featured = useQuery({
    queryKey: ['featuredCases', 'popular'],
    queryFn: getPopularCases,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="relative isolate min-h-[max(733px,calc(100dvh-59px))] overflow-hidden pt-[17px]">
      <img
        src={ground}
        alt=""
        className="pointer-events-none absolute left-[calc(50%+0.5px)] top-[466px] -z-10 block max-w-none -translate-x-1/2"
      />
      {/* 움직이는 토끼 */}
      <video
        src={rabbitHome}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        width={756}
        height={390}
        // 일부 기기에서 영상 아래에 검은 선이 생겨서 2px씩 잘라냈어요!!
        className="pointer-events-none absolute inset-x-0 top-[408px] -z-10 block h-auto w-full [clip-path:inset(0_2px_2px_0)]"
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
          onClick={startJudgment}
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
          {...scroll}
          className="mt-[10px] flex cursor-grab select-none gap-[8px] overflow-x-auto overscroll-x-contain px-[24px] active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featured.data?.map((item) => (
            <li
              key={item.case_id}
              className="relative h-[137px] w-[232px] shrink-0 rounded-[20px] bg-white-100"
            >
              <Link to={paths.juryParticipate(item.case_id)} aria-label={item.title} className="absolute inset-0 rounded-[20px] focus-visible:outline-2 focus-visible:outline-keycolor-40">
              <span className="text-l1-medium absolute left-[15px] top-[17px] rounded-[50px] bg-keycolor-5 px-[8px] py-[4px] text-keycolor-100">
                {item.relation}
              </span>
              <h3 className="text-b2-medium absolute left-[18px] top-[49px] w-[189px] line-clamp-2 break-words text-gray-90">
                {item.title}
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
                  {item.jury_count}명 참여
                </span>
              </div>
              </Link>
            </li>
          ))}
        </ul>
        {featured.isPending && <p role="status" className="text-b2-regular mx-6 py-4">사건을 불러오는 중이에요.</p>}
        {featured.isError && <div role="alert" className="text-b2-regular mx-6 py-4">
          <p>사건을 불러오지 못했어요.</p>
          <Button onClick={() => void featured.refetch()} className="mt-2 underline">다시 시도</Button>
        </div>}
        {featured.isSuccess && featured.data.length === 0 && <p role="status" className="text-b2-regular mx-6 py-4">아직 공개된 사건이 없어요.</p>}
      </section>
    </div>
  );
}

export default HomePage;
