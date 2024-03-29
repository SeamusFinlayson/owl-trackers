import { InputHTMLAttributes, useEffect, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";

export default function BubbleInput({
  tracker,
  color,
  updateHandler,
  inputProps,
  animateOnlyWhenRootActive = false,
}: {
  tracker: Tracker;
  color: number;
  updateHandler: (content: string) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  animateOnlyWhenRootActive?: boolean;
}): JSX.Element {
  const [value, setValue] = useState<string>(tracker.value.toString());

  // Update value when the tracker value changes in parent
  const [valueInputUpdateFlag, setValueInputUpdateFlag] = useState(false);
  if (valueInputUpdateFlag) {
    setValue(tracker.value.toString());
    setValueInputUpdateFlag(false);
  }
  useEffect(() => setValueInputUpdateFlag(true), [tracker.value]);

  // Update tracker in parent element
  const runUpdateHandler = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    updateHandler((e.target as HTMLInputElement).value);
    setValueInputUpdateFlag(true);
  };

  // Select text on focus
  const selectText = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
  };

  return (
    <div
      className={`${getBackgroundColor(color)} ${animateOnlyWhenRootActive ? "group-focus-within/root:duration-75 group-hover/root:duration-75" : "duration-75"} h-[44px] w-[44px] justify-center rounded-full pb-[2px] pr-[0px] outline outline-2 -outline-offset-2 drop-shadow-sm focus-within:outline-offset-0 focus-within:drop-shadow-lg dark:outline-white/40 dark:focus-within:outline-white/60`}
    >
      <input
        {...inputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => runUpdateHandler(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") runUpdateHandler(e);
        }}
        onFocus={selectText}
        className={`${animateOnlyWhenRootActive ? "group-focus-within/root:duration-100 group-hover/root:duration-100" : "duration-100"} h-[44px] w-[44px] justify-center rounded-full bg-transparent pb-[0px] pr-[0px] text-center font-medium text-text-primary outline-none hover:bg-black/10 focus:bg-black/15 dark:text-text-primary-dark`}
        placeholder=""
      ></input>
    </div>
  );
}
