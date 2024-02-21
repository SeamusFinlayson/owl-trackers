import { InputHTMLAttributes, useEffect, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker, updateTrackerField } from "../itemHelpers";

export default function BubbleInput({
  tracker,
  setTrackers,
  color,
  inputProps,
}: {
  tracker: Tracker;
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>;
  color: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}): JSX.Element {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    event.target.select();
  };

  const [value, setValue] = useState<string>(tracker.value.toString());
  const [valueInputUpdateFlag, setValueInputUpdateFlag] = useState(false);

  if (valueInputUpdateFlag) {
    setValue(tracker.value.toString());
    setValueInputUpdateFlag(false);
  }

  useEffect(() => setValueInputUpdateFlag(true), [tracker.value]);

  const updateTracker = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    updateTrackerField(
      tracker.id,
      "value",
      (e.target as HTMLInputElement).value,
      setTrackers,
    );
    setValueInputUpdateFlag(true);
  };

  return (
    <div
      className={`h-[44px] w-[44px] pb-[2px] pr-[0px] ${getBackgroundColor(color)} justify-center rounded-full drop-shadow-sm transition-shadow focus-within:drop-shadow-lg`}
    >
      <input
        {...inputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => updateTracker(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateTracker(e);
        }}
        onFocus={handleFocus}
        className={`duration-50selection:bl h-[44px] w-[44px] justify-center rounded-full bg-transparent pb-[0px] pr-[0px] text-center font-medium  outline-none -outline-offset-2 outline-white/40 focus:bg-black/10 focus:outline-white/60`}
        placeholder=""
      ></input>
    </div>
  );
}
