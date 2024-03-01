import { useOwlbearStore } from "../useOwlbearStore";
import HeaderButton from "../components/HeaderButton";

export function Action({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const mode = useOwlbearStore((state) => state.mode);

  return (
    <div className={mode === "DARK" ? "dark" : ""}>
      <div className="m-4 grid grid-cols-[minmax(120px,_auto)_repeat(3,_42px)] items-center p-0">
        <p className="m-0 text-xl font-bold tracking-[0px] text-text-primary dark:text-text-primary-dark">
          Owl Trackers
        </p>

        <HeaderButton variant="patreon"></HeaderButton>

        <HeaderButton variant="changeLog"></HeaderButton>

        <HeaderButton variant="help"></HeaderButton>
      </div>

      <hr className="mx-[16px] my-[12px] border-text-primary dark:border-text-primary-dark/10"></hr>

      <div className="w-full px-4">
        <div className="grid w-full grid-cols-[auto_50px] items-center gap-x-1 gap-y-4">
          {children}
        </div>
      </div>

      <div className="m-4 flex flex-row gap-2">
        <a
          className="flex flex-row items-center gap-2 rounded-lg border-none bg-black/15 p-2 text-center text-text-primary no-underline dark:text-text-primary-dark"
          title=""
          href="https://discord.gg/WMp9bky4be"
          target="_blank"
          rel="noreferrer noopener"
        >
          <p className="settings-label">[Add icon] Report Bug</p>
        </a>
      </div>
    </div>
  );
}
