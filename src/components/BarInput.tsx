import { InputHTMLAttributes, useEffect, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker, updateTrackerField } from "../itemHelpers";

export default function BarInput({
  tracker,
  setTrackers,
  color,
  valueInputProps,
  maxInputProps,
}: {
  tracker: Tracker;
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>;
  color: number;
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
    updateTrackerField(
      tracker.id,
      field,
      (e.target as HTMLInputElement).value,
      setTrackers,
    );
    setValueInputUpdateFlag(true);
  };

  return (
    <div
      className={`flex h-[44px] w-[100px] flex-row justify-between pb-[2px] pr-[0px] ${getBackgroundColor(color)} justify-center rounded-xl outline-none -outline-offset-2 drop-shadow-sm duration-100 focus-within:drop-shadow-lg dark:outline-white/40 focus-within:dark:outline-white/60`}
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
        className={`text-text-primary dark:text-text-primary-dark duration-50 h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[0px] pr-[0px] text-center font-medium outline-none focus:bg-black/10`}
        placeholder=""
      ></input>
      <div className="text-text-primary dark:text-text-primary-dark self-center pt-[2px]">
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
        className={`text-text-primary dark:text-text-primary-dark duration-50 h-[44px] w-[44px] justify-center rounded-xl bg-transparent pb-[0px] pr-[0px] text-center font-medium outline-none focus:bg-black/10`}
        placeholder=""
      ></input>
    </div>
  );
}
