import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/Button";
import Modal from "../../components/modal/Modal";
import { useNavigate } from "react-router-dom";
import { getCases } from "../../apis/caseApi";
import { getMyJuryActivities } from "../../apis/juryApi";
import { getMe, logout } from "../../apis/accountApi";
import { useSignOut } from "../../hooks/useSignOut";
import { paths } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import profileRabbit from "../../assets/my/profile-rabbit.png";
import tolIcon from "../../assets/my/tol.svg";

function MyPage() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 내 정보 (닉네임 / 보유 이용권)
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  const cases = useQuery({
    queryKey: ["myCaseCount"],
    queryFn: async () => (await getCases({ page: 1 })).count,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const activities = useQuery({
    queryKey: ["myJuryActivityCount", "votes"],
    queryFn: async () =>
      (await getMyJuryActivities({ page: 1, type: "votes" })).count,
    staleTime: 0,
    refetchOnMount: "always",
  });

  // 서버에서 refresh 토큰을 폐기하고 로그아웃 (서버 요청이 실패해도 이 기기에서는 로그아웃)
  const handleLogout = async () => {
    if (refreshToken) await logout(refreshToken).catch(() => {});
    signOut();
  };

  return (
    <div className="pt-[7px]">
      <section
        aria-label="내 프로필"
        className="ml-[23px] mr-[24px] overflow-hidden rounded-[20px] bg-white-100 text-gray-90"
      >
        <div className="flex h-[146px] flex-col items-center gap-[8px] pl-px pt-[29px]">
          <div className="relative size-[58px] shrink-0 overflow-hidden rounded-full bg-[#ffd95c]">
            <img
              src={profileRabbit}
              alt="달토끼 프로필"
              className="absolute left-[-4.35px] top-[-10.15px] size-[68.15px] max-w-none object-cover"
            />
          </div>
          <h1 className="text-h3-medium">{me?.nickname}</h1>
        </div>
        <div className="grid h-[83px] grid-cols-2 border-t border-gray-10">
          <Button
            onClick={() => navigate(paths.myCases)}
            className="flex cursor-pointer flex-col items-center border-r border-gray-10 pt-[17px]"
          >
            <span className="text-b2-regular translate-x-[2.75px] text-gray-50">
              내 사건
            </span>
            <span className="text-b1-semibold translate-x-[2.75px]">
              {cases.isError
                ? "조회 실패"
                : cases.data === undefined
                  ? "…"
                  : `${cases.data}건`}
            </span>
          </Button>
          <Button
            onClick={() => navigate(paths.myJuryActivity)}
            className="flex cursor-pointer flex-col items-center pt-[17px]"
          >
            <span className="text-b2-regular -translate-x-[1.5px] text-gray-50">
              배심 활동
            </span>
            <span className="text-b1-semibold -translate-x-[1.5px]">
              {activities.isError
                ? "조회 실패"
                : activities.data === undefined
                  ? "…"
                  : `${activities.data}건`}
            </span>
          </Button>
        </div>
      </section>

      {(cases.isError || activities.isError) && (
        <div
          role="alert"
          className="mx-[24px] mt-2 text-l1-regular text-gray-60"
        >
          건수를 불러오지 못했어요.{" "}
          <Button
            className="underline"
            onClick={() => {
              if (cases.isError) void cases.refetch();
              if (activities.isError) void activities.refetch();
            }}
          >
            다시 시도
          </Button>
        </div>
      )}

      <section aria-labelledby="tol-heading" className="mt-[23px]">
        <h2 id="tol-heading" className="text-l1-regular ml-[24px]">
          이용권 관리
        </h2>
        <div className="mt-[9.5px] flex flex-col gap-[2px] text-gray-90">
          <div className="text-b2-medium relative flex h-[46px] items-center bg-white-100 pl-[26px] pt-px">
            <span>보유 이용권</span>
            <span className="absolute left-[calc(100%-77px)] top-[12px] flex items-center gap-px">
              <span
                className="relative size-[21px] overflow-hidden"
                aria-hidden="true"
              >
                <img
                  src={tolIcon}
                  alt=""
                  className="absolute left-[4.691px] top-[0.431px] block max-w-none rotate-[19.17deg]"
                />
              </span>
              <span>{me ? `${me.coin_balance}톨` : ""}</span>
            </span>
          </div>
          <Button
            onClick={() => navigate(paths.tollCharge)}
            className="text-b2-medium flex h-[46px] cursor-pointer items-center bg-white-100 pl-[26px] pt-px text-left"
          >
            이용권 충전하기
          </Button>
          <Button
            onClick={() => navigate(paths.myTicketHistory)}
            className="text-b2-medium flex h-[46px] cursor-pointer items-center bg-white-100 pl-[26px] pt-px text-left"
          >
            이용권 이용 내역
          </Button>
        </div>
      </section>

      <section aria-labelledby="settings-heading" className="mt-[28px]">
        <h2 id="settings-heading" className="text-l1-regular ml-[24px]">
          계정 및 설정
        </h2>
        <div className="mt-[9.5px] flex flex-col gap-[2px] text-gray-90">
          <Button
            onClick={() => navigate(paths.myAccount)}
            className="text-b2-medium flex h-[46px] cursor-pointer items-center bg-white-100 pl-[26px] pt-px text-left"
          >
            계정 관리
          </Button>
          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-b2-medium flex h-[46px] cursor-pointer items-center bg-white-100 pl-[26px] pt-px text-left"
          >
            로그아웃
          </Button>
        </div>
      </section>

      {/* 로그아웃 팝업 (4-4) */}
      <Modal
        open={isLogoutModalOpen}
        title="로그아웃"
        description="로그아웃하시겠습니까?"
        cancelText="취소"
        confirmText="로그아웃"
        wideConfirm
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default MyPage;
