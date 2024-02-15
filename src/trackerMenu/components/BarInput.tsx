import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  bgColor: number;
}

export default function BarInput({
  color,
  value,
  max,
  inputProps,
}: {
  color: number;
  value: number;
  max: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
  };

  let backgroundColor: string;
  switch (color) {
    default:
    case 0:
      backgroundColor = "bg-fuchsia-500/40";
      break;
    case 1:
      backgroundColor = "bg-pink-600/50";
      break;
    case 2:
      backgroundColor = "bg-red-700/70";
      break;
    case 3:
      backgroundColor = "bg-lime-400/30";
      break;
    case 4:
      backgroundColor = "bg-emerald-400/30";
      break;
    case 5:
      backgroundColor = "bg-cyan-300/30";
      break;
    case 6:
      backgroundColor = "bg-blue-500/30";
      break;
  }

  return (
    <div
      className={`flex h-[44px] w-[100px] flex-row justify-between pb-[2px] pr-[0px] ${backgroundColor} justify-center rounded-xl outline-none -outline-offset-2 outline-white/40 drop-shadow-sm duration-100 focus-within:outline-white/60 focus-within:drop-shadow-lg`}
    >
      <input
        value={value}
        {...inputProps}
        onFocus={handleFocus}
        className={`duration-50 h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[2px] pr-[0px] text-center font-medium outline-none focus:bg-black/10`}
        placeholder=""
      ></input>
      <div className="self-center pb-[1px]">/</div>
      <input
        value={max}
        {...inputProps}
        onFocus={handleFocus}
        className={`duration-50 h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[2px] pr-[0px] text-center font-medium outline-none focus:bg-black/10`}
        placeholder=""
      ></input>
    </div>
  );
}
