import { ComponentType, useState } from "react";
import { IconProps } from "./IconPropsType";

export default function IconToggle({
  active,
  onClick,
  ActiveIcon,
  InactiveIcon,
}: {
  active: boolean;
  onClick: () => void;
  ActiveIcon: ComponentType<IconProps>;
  InactiveIcon: ComponentType<IconProps>;
}): JSX.Element {
  const [animate, setAnimate] = useState(false);
  const endAnimation = () => {
    setAnimate(false);
  };

  return (
    <button
      className="group flex h-[30px] w-[30px] items-center justify-center rounded-full outline-none duration-200 focus:outline-none"
      onKeyDown={() => setAnimate(true)}
      onPointerDown={() => {
        // onClick();
        // setAnimate(true);
      }}
      onClick={() => {
        onClick();
        setAnimate(true);
      }}
    >
      {active ? (
        <ActiveIcon
          className={
            "fill-violet-300/80 duration-200 group-hover:fill-violet-300/100 group-focus-visible:fill-violet-300/100 group-active:fill-violet-300/100"
          }
        ></ActiveIcon>
      ) : (
        <InactiveIcon
          className={
            "fill-white/50 duration-200 group-hover:fill-white/90 group-focus-visible:fill-white/90 group-active:fill-white/90"
          }
        ></InactiveIcon>
      )}
      {/* <InactiveIcon
        className={`absolute ${animate && "animate-[ping_0.15s_1]"} fill-violet-300/0 duration-500 group-active:fill-violet-300/30 group-active:duration-0`}
        onAnimationEnd={endAnimation}
      ></InactiveIcon> */}
    </button>
  );
}
