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
      className=" w-full bg-transparent px-1.5 pt-1 text-base text-text-primary placeholder-text-secondary outline-none duration-100 dark:text-text-primary-dark dark:placeholder-text-secondary-dark"
      placeholder="Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
