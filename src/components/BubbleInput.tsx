import { InputHTMLAttributes, useEffect, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";

export default function BubbleInput({
  valueControl,
  color,
  inputProps,
}: {
  valueControl: number;
  color: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
  };

  const [value, setValue] = useState<number | string>(valueControl);
  useEffect(() => setValue(valueControl), [valueControl]);

  return (
    <div
      className={`h-[44px] w-[44px] pb-[2px] pr-[0px] ${getBackgroundColor(color)} justify-center rounded-full drop-shadow-sm transition-shadow focus-within:drop-shadow-lg`}
    >
      <input
        {...inputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        className={`duration-50selection:bl h-[44px] w-[44px] justify-center rounded-full bg-transparent pb-[2px] pr-[0px] text-center font-medium  outline-none -outline-offset-2 outline-white/40 focus:bg-black/10 focus:outline-white/60`}
        placeholder=""
      ></input>
    </div>
  );
}
