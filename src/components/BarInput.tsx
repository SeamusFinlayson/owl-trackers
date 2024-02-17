import { InputHTMLAttributes, useEffect, useState } from "react";

export default function BarInput({
  valueControl,
  maxControl,
  color,
  valueInputProps,
  maxInputProps,
}: {
  valueControl: number;
  maxControl: number;
  color: number;
  valueInputProps?: InputHTMLAttributes<HTMLInputElement>;
  maxInputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  const [value, setValue] = useState<number | string>(valueControl);
  useEffect(() => setValue(valueControl), [valueControl]);

  const [max, setMax] = useState<number | string>(maxControl);
  useEffect(() => setMax(maxControl), [maxControl]);

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
        {...valueInputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        className={`duration-50 h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[2px] pr-[0px] text-center font-medium outline-none focus:bg-black/10`}
        placeholder=""
      ></input>
      <div className="self-center pb-[1px]">/</div>
      <input
        {...maxInputProps}
        value={max}
        onChange={(e) => setMax(e.target.value)}
        onFocus={handleFocus}
        className={`duration-50 h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[2px] pr-[0px] text-center font-medium outline-none focus:bg-black/10`}
        placeholder=""
      ></input>
    </div>
  );
}
