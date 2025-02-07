import { InputHTMLAttributes, useEffect, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";

export default function BubbleInput({
  tracker,
  color,
  updateHandler,
  inputProps,
  animateOnlyWhenRootActive = false,
  hideLabel = false,
}: {
  tracker: Tracker;
  color: number;
  updateHandler: (content: string) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  animateOnlyWhenRootActive?: boolean;
  hideLabel?: boolean;
}): JSX.Element {
  const [value, setValue] = useState<string>(tracker.value.toString());
  let ignoreBlur = false;

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

  const animationDuration75 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-75 group-hover/root:duration-75"
    : "duration-75";
  const animationDuration100 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-100 group-hover/root:duration-100"
    : "duration-100";

  return (
    <div>
      {!hideLabel && (
        <div className="text-2xs min-h-[14.5px] max-w-[44px] overflow-clip text-nowrap text-center text-text-secondary dark:text-text-secondary-dark">
          {tracker.name}
        </div>
      )}
      <div
        className={`${animationDuration75} grid grid-cols-1 grid-rows-1 place-items-center drop-shadow-sm focus-within:drop-shadow-md`}
      >
        <div
          className={`${animationDuration75} ${getBackgroundColor(color)} peer col-span-full row-span-full size-[44px] rounded-xl dark:outline dark:outline-2 dark:-outline-offset-2 dark:outline-white/40 dark:focus-within:outline-offset-0 dark:focus-within:outline-white/60`}
        >
          <input
            {...inputProps}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => {
              if (!ignoreBlur) runUpdateHandler(e);
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
            onFocus={selectText}
            className={`${animationDuration100} size-[44px] rounded-xl bg-transparent text-center font-medium text-text-primary outline-none hover:bg-white/10 focus:bg-white/15 dark:text-text-primary-dark dark:hover:bg-black/10 dark:focus:bg-black/15`}
            placeholder=""
          ></input>
        </div>
        <div
          className={`${animationDuration75} ${getBackgroundColor(color)} -z-10 col-span-full row-span-full size-[44px] rounded-xl peer-focus-within:scale-[1.18] dark:invisible`}
        ></div>
      </div>
    </div>
  );
}
