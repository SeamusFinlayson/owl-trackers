import { ComponentType } from "react";
import { IconProps } from "./IconPropsType";

export default function IconButton({
  Icon,
  onClick,
  rounded = "rounded-full",
  padding = "p-[2px]",
}: {
  Icon: ComponentType<IconProps>;
  onClick: () => void;
  rounded?: string;
  padding?: string;
}): JSX.Element {
  // const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`group flex items-center justify-center ${rounded} ${padding} outline-none duration-300`}
      onClick={onClick}
      // onKeyDown={() => setAnimate(true)}
      // onPointerDown={() => setAnimate(true)}
    >
      <div
        className={`flex h-[36px] w-[36px] items-center justify-center ${rounded} group-hover:bg-white/10 group-focus-visible:bg-white/10`}
      >
        <Icon className={`h-[24px] w-[24px] fill-white/75`}></Icon>
      </div>
      {/* <Icon
        className={`absolute ${animate && "animate-[ping_0.15s_1]"} fill-violet-300/0 duration-500  group-active:fill-violet-300/30 group-active:duration-0`}
        onAnimationEnd={() => setAnimate(false)}
      ></Icon> */}
    </button>
  );
}
