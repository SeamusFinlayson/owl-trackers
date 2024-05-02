import { InputHTMLAttributes, useEffect, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";

export default function BarInput({
  tracker,
  color,
  updateValueMetadata,
  updateMaxMetadata,
  valueInputProps,
  maxInputProps,
  animateOnlyWhenRootActive = false,
}: {
  tracker: Tracker;
  color: number;
  updateValueMetadata: (content: string) => void;
  updateMaxMetadata: (content: string) => void;
  valueInputProps?: InputHTMLAttributes<HTMLInputElement>;
  maxInputProps?: InputHTMLAttributes<HTMLInputElement>;
  animateOnlyWhenRootActive?: boolean;
}): JSX.Element {
  if (tracker.variant !== "value-max")
    throw `Error expected 'value-max' tracker, got '${tracker.variant}' tracker`;

  const [value, setValue] = useState<string>(tracker.value.toString());
  const [valueInputUpdateFlag, setValueInputUpdateFlag] = useState(false);
  let ignoreBlur = false;

  if (valueInputUpdateFlag) {
    setValue(tracker.value.toString());
    setValueInputUpdateFlag(false);
  }

  useEffect(() => setValueInputUpdateFlag(true), [tracker.value]);

  const [max, setMax] = useState<string>(tracker.max.toString());
  const [maxInputUpdateFlag, setMaxInputUpdateFlag] = useState(false);

  if (maxInputUpdateFlag) {
    setMax(tracker.max.toString());
    setMaxInputUpdateFlag(false);
  }

  useEffect(() => setMaxInputUpdateFlag(true), [tracker.max]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
  };

  const updateTracker = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>,
    field: "value" | "max",
  ) => {
    if (field === "value") {
      updateValueMetadata((e.target as HTMLInputElement).value);
    } else {
      updateMaxMetadata((e.target as HTMLInputElement).value);
    }
    setValueInputUpdateFlag(true);
  };

  const animationDuration75 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-75 group-hover/root:duration-75"
    : "duration-75";
  const animationDuration100 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-100 group-hover/root:duration-100"
    : "duration-100";

  return (
    <div
      className={`${animationDuration75} grid grid-cols-1 grid-rows-1 place-items-center drop-shadow-sm focus-within:drop-shadow-md`}
    >
      <div
        className={`${animationDuration75} ${getBackgroundColor(color)} peer col-span-full row-span-full flex h-[44px] w-[100px] flex-row justify-between rounded-xl pb-[2px] outline-0 dark:outline dark:outline-2 dark:-outline-offset-2 dark:outline-white/40 dark:focus-within:outline-offset-0 dark:focus-within:outline-white/60`}
      >
        <input
          {...valueInputProps}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => {
            if (!ignoreBlur) updateTracker(e, "value");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") {
              ignoreBlur = true;
              (e.target as HTMLInputElement).blur();
              ignoreBlur = false;
              setValue(tracker.value.toString());
            }
          }}
          onFocus={handleFocus}
          className={`${animationDuration100} size-[44px] rounded-xl bg-transparent text-center font-medium text-text-primary outline-none hover:bg-white/10 focus:bg-white/15 dark:text-text-primary-dark dark:hover:bg-black/10 dark:focus:bg-black/15`}
          placeholder=""
        ></input>
        <div className="self-center pt-[2px] text-text-primary dark:text-text-primary-dark">
          /
        </div>
        <input
          {...maxInputProps}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onBlur={(e) => {
            if (!ignoreBlur) updateTracker(e, "max");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") {
              ignoreBlur = true;
              (e.target as HTMLInputElement).blur();
              ignoreBlur = false;
              setMax(tracker.max.toString());
            }
          }}
          onFocus={handleFocus}
          className={`${animationDuration100} size-[44px] rounded-xl bg-transparent text-center font-medium text-text-primary outline-none hover:bg-white/10 focus:bg-white/15 dark:text-text-primary-dark dark:hover:bg-black/10 dark:focus:bg-black/15`}
          placeholder=""
        ></input>
      </div>
      <div
        className={`${animationDuration75} ${getBackgroundColor(color)} -z-10 col-span-full row-span-full h-[44px] w-[100px] rounded-xl peer-focus-within:scale-x-[1.08] peer-focus-within:scale-y-[1.18] dark:bg-transparent`}
      ></div>
    </div>
  );
}
