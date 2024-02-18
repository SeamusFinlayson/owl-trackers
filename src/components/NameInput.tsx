import { InputHTMLAttributes, useEffect, useState } from "react";

export default function NameInput({
  valueControl,
  inputProps,
}: {
  valueControl: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  const [value, setValue] = useState<number | string>(valueControl);
  useEffect(() => setValue(valueControl), [valueControl]);

  return (
    <input
      {...inputProps}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Name"
      className="h-[36px] w-full rounded-md bg-black/10 px-1.5 py-1 outline-none duration-100 hover:bg-black/20 focus:bg-black/40"
    ></input>
  );
}
