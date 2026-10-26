import background from "../assets/gnb/gnb-background.svg";
import aiTrial from "../assets/gnb/ai-trial.svg";
import homeActive from "../assets/gnb/home-active.svg";
import homeInactive from "../assets/gnb/home-inactive.svg";
import juryActive from "../assets/gnb/jury-active.svg";
import juryInactive from "../assets/gnb/jury-inactive.svg";
import myActive from "../assets/gnb/my-active.svg";
import myInactive from "../assets/gnb/my-inactive.svg";
import Button from "./Button";

export type GNBTab = "home" | "jury" | "my";
export type GNBDestination = GNBTab | "ai-trial";

type GNBProps = {
  activeTab: GNBTab;
  onNavigate: (destination: GNBDestination) => void;
};

const tabs = [
  {
    id: "home",
    label: "홈",
    active: homeActive,
    inactive: homeInactive,
    position: "left-[10px] top-[10.4px]",
  },
  {
    id: "jury",
    label: "배심원석",
    active: juryActive,
    inactive: juryInactive,
    position: "left-[10px] top-[14px]",
  },
  {
    id: "my",
    label: "마이",
    active: myActive,
    inactive: myInactive,
    position: "left-[8px] top-[8px]",
  },
] as const;

function GNB({ activeTab, onNavigate }: GNBProps) {
  return (
    <nav
      aria-label="주 메뉴"
      className="relative h-[48.435546875px] w-[185.8212890625px] shrink-0 drop-shadow-[0px_0px_35.25px_rgba(34,35,53,0.25)]"
    >
      <img
        src={background}
        alt=""
        className="pointer-events-none absolute left-0 top-0 block max-w-none"
      />
      <Button
        type="button"
        aria-label="AI 재판"
        onClick={() => onNavigate("ai-trial")}
        className="absolute left-[11px] top-[10px] size-[28px] cursor-pointer"
      >
        <img src={aiTrial} alt="" className="block max-w-none" />
      </Button>
      <div className="absolute left-[61px] top-[4px] flex">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              type="button"
              aria-label={tab.label}
              aria-current={selected ? "page" : undefined}
              onClick={() => onNavigate(tab.id)}
              className={`relative size-[40px] shrink-0 cursor-pointer rounded-[480px] ${selected ? "bg-bg" : "bg-gray-10"}`}
            >
              <img
                src={selected ? tab.active : tab.inactive}
                alt=""
                className={`absolute block max-w-none ${tab.position}`}
              />
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

export default GNB;
