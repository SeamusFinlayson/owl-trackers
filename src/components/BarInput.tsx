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
}: {
  tracker: Tracker;
  color: number;
  updateValueMetadata: (content: string) => void;
  updateMaxMetadata: (content: string) => void;
  valueInputProps?: InputHTMLAttributes<HTMLInputElement>;
  maxInputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  if (tracker.variant !== "value-max")
    throw `Error expected 'value-max' tracker, got '${tracker.variant}' tracker`;

  const [value, setValue] = useState<string>(tracker.value.toString());
  const [valueInputUpdateFlag, setValueInputUpdateFlag] = useState(false);

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

  return (
    <div
      className={`${getBackgroundColor(color)} flex h-[44px] w-[100px] flex-row justify-between rounded-xl pb-[2px] pr-[0px] outline outline-2 -outline-offset-2 drop-shadow-sm focus-within:outline-offset-0 focus-within:drop-shadow-lg focus-within:duration-100 dark:outline-white/40 dark:focus-within:outline-white/60`}
    >
      <input
        {...valueInputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => updateTracker(e, "value")}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateTracker(e, "value");
        }}
        onFocus={handleFocus}
        className={`h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[0px] pr-[0px] text-center font-medium text-text-primary outline-none duration-100 hover:bg-black/10 focus:bg-black/15 dark:text-text-primary-dark`}
        placeholder=""
      ></input>
      <div className="self-center pt-[2px] text-text-primary dark:text-text-primary-dark">
        /
      </div>
      <input
        {...maxInputProps}
        value={max}
        onChange={(e) => setMax(e.target.value)}
        onBlur={(e) => updateTracker(e, "max")}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateTracker(e, "max");
        }}
        onFocus={handleFocus}
        className={`h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[0px] pr-[0px] text-center font-medium text-text-primary outline-none duration-100 hover:bg-black/10 focus:bg-black/15 dark:text-text-primary-dark`}
        placeholder=""
      ></input>
    </div>
  );
}
