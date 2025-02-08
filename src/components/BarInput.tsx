import { InputHTMLAttributes, useState } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";
import PartiallyControlledInput from "./PartiallyControlledInput";

export default function BarInput({
  tracker,
  color,
  valueUpdateHandler,
  maxUpdateHandler,
  valueInputProps,
  maxInputProps,
  animateOnlyWhenRootActive = false,
  noBackground,
}: {
  tracker: Tracker;
  color: number;
  valueUpdateHandler: (content: string) => void;
  maxUpdateHandler: (content: string) => void;
  valueInputProps?: InputHTMLAttributes<HTMLInputElement>;
  maxInputProps?: InputHTMLAttributes<HTMLInputElement>;
  animateOnlyWhenRootActive?: boolean;
  noBackground?: boolean;
}): JSX.Element {
  if (tracker.variant !== "value-max")
    throw `Error expected 'value-max' tracker, got '${tracker.variant}' tracker`;

  const animationDuration100 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-100 group-hover/root:duration-100"
    : "duration-100";
  const animationDuration300 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-300 group-hover/root:duration-300"
    : "duration-300";

  const [focusTarget, setFocusTarget] = useState<"value" | "max">("value");

  const ValueInput = (
    <PartiallyControlledInput
      {...valueInputProps}
      className="h-[44px] w-full bg-transparent text-center outline-none"
      parentValue={tracker.value.toString()}
      onFocus={() => setFocusTarget("value")}
      onUserConfirm={(target) => valueUpdateHandler(target.value)}
      clearContentOnFocus
    />
  );
  const MaxInput = (
    <PartiallyControlledInput
      {...maxInputProps}
      className="h-[44px] w-full bg-transparent text-center outline-none"
      parentValue={tracker.max.toString()}
      onFocus={() => setFocusTarget("max")}
      onUserConfirm={(target) => maxUpdateHandler(target.value)}
      clearContentOnFocus
    />
  );

  if (noBackground) {
    return (
      <div
        className={`${noBackground ? "" : getBackgroundColor(color)} flex w-full items-center rounded-2xl text-text-primary dark:text-text-primary-dark`}
      >
        <div className="group grid place-items-center">
          <div
            className={`${animationDuration100} text-2xs pointer-events-none col-start-1 row-start-1 min-h-[14.5px] w-full max-w-full translate-y-3 overflow-clip text-nowrap text-center opacity-0 transition-all group-focus-within:translate-y-[18px] group-focus-within:opacity-100`}
          >
            {tracker.value}
          </div>
          <div className="col-start-1 row-start-1">{ValueInput}</div>
        </div>
        <div className="self-center pt-[2px]">/</div>
        <div className="group grid place-items-center">
          <div
            className={`${animationDuration100} text-2xs pointer-events-none col-start-1 row-start-1 min-h-[14.5px] w-full max-w-full translate-y-3 overflow-clip text-nowrap text-center opacity-0 transition-all group-focus-within:translate-y-[18px] group-focus-within:opacity-100`}
          >
            {tracker.max}
          </div>
          <div className="col-start-1 row-start-1">{MaxInput}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group text-text-primary dark:text-text-primary-dark">
      <div className=" grid">
        <div
          className={`${animationDuration300} text-2xs col-start-1 row-start-1 min-h-[14.5px] w-full overflow-clip text-nowrap text-center opacity-0 transition-opacity  group-focus-within:opacity-100`}
        >
          {focusTarget === "value" ? tracker.value : tracker.max}
        </div>
        <div
          className={`${animationDuration300} text-2xs col-start-1 row-start-1 min-h-[14.5px] w-full overflow-clip text-nowrap text-center opacity-100 transition-opacity  group-focus-within:opacity-0`}
        >
          {tracker.name}
        </div>
      </div>

      <div>
        <div
          className={`${noBackground ? "" : getBackgroundColor(color)} flex h-[44px] w-[100px] items-center rounded-2xl`}
        >
          {ValueInput}
          <div className="self-center pt-[2px]">/</div>
          {MaxInput}
        </div>
      </div>
    </div>
  );
}
