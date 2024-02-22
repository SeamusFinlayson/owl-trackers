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
      className="text-text-primary dark:text-text-primary-dark bg-default/50 hover:bg-default/70 focus:bg-default dark:bg-default-dark/40 hover:dark:bg-default-dark/60 focus:dark:bg-default-dark h-[36px] w-full rounded-md px-1.5 py-1 outline-none duration-100"
    ></input>
  );
}
