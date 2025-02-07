import { ComponentType } from "react";
import { IconProps } from "./IconPropsType";

export default function IconButton({
  Icon,
  onClick,
  rounded = "rounded-full",
  padding = "p-[2px]",
  danger = false,
}: {
  Icon: ComponentType<IconProps>;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  rounded?: string;
  padding?: string;
  danger?: boolean;
}): JSX.Element {
  // const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`group flex items-center justify-center ${rounded} ${padding} outline-none`}
      onClick={onClick}
      // onKeyDown={() => setAnimate(true)}
      // onPointerDown={() => setAnimate(true)}
    >
      <div
        className={`flex h-[36px] w-[36px] items-center justify-center duration-100 ${rounded} ${danger ? "group-hover:bg-red-400/60 group-focus-visible:bg-red-400/60 group-hover:dark:bg-red-400/30 group-focus-visible:dark:bg-red-400/30" : "group-hover:bg-black/10 group-focus-visible:bg-black/10 group-hover:dark:bg-white/10 group-focus-visible:dark:bg-white/10"}`}
      >
        <Icon
          className={`h-[24px] w-[24px] fill-text-secondary dark:fill-text-secondary-dark`}
        ></Icon>
      </div>
      {/* <Icon
        className={`absolute ${animate && "animate-[ping_0.15s_1]"} fill-violet-300/0 duration-500  group-active:fill-violet-300/30 group-active:duration-0`}
        onAnimationEnd={() => setAnimate(false)}
      ></Icon> */}
    </button>
  );
}
