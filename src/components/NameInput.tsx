// import { TextField } from "@mui/material";
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
      className="h-[36px] w-full bg-default/50 px-1.5 py-1 text-base text-text-primary outline-none duration-100 hover:bg-default/70 focus:bg-default  dark:bg-default-dark/50 dark:text-text-primary-dark focus:dark:bg-default-dark/65"
      placeholder="Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
