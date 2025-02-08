import { InputHTMLAttributes } from "react";
import { getBackgroundColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";
import PartiallyControlledInput from "./PartiallyControlledInput";

export default function BubbleInput({
  tracker,
  color,
  updateHandler,
  inputProps,
  animateOnlyWhenRootActive = false,
  noBackground = false,
}: {
  tracker: Tracker;
  color: number;
  updateHandler: (content: string) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  animateOnlyWhenRootActive?: boolean;
  noBackground?: boolean;
}): JSX.Element {
  // const animationDuration75 = animateOnlyWhenRootActive
  //   ? "group-focus-within/root:duration-75 group-hover/root:duration-75"
  //   : "duration-75";
  const animationDuration100 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-100 group-hover/root:duration-100"
    : "duration-100";
  const animationDuration300 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-300 group-hover/root:duration-300"
    : "duration-300";

  const Input = (
    <PartiallyControlledInput
      {...inputProps}
      parentValue={tracker.value.toString()}
      onUserConfirm={(target) => updateHandler(target.value)}
      className="h-[44px] w-full bg-transparent text-center outline-none"
      clearContentOnFocus
    />
  );

  if (noBackground) {
    return (
      <div className="flex  items-center text-text-primary dark:text-text-primary-dark">
        <div className="group grid place-items-center">
          <div
            className={`${animationDuration100} text-2xs pointer-events-none col-start-1 row-start-1  min-h-[14.5px] w-full max-w-full translate-y-3 overflow-clip text-nowrap text-center  opacity-0 transition-all group-focus-within:translate-y-[18px] group-focus-within:opacity-100`}
          >
            {tracker.value}
          </div>
          <div className="col-start-1 row-start-1">{Input}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group text-text-primary dark:text-text-primary-dark">
      <div className="grid">
        <div
          className={`${animationDuration300} text-2xs col-start-1 row-start-1 min-h-[14.5px] max-w-[44px] overflow-clip text-nowrap text-center  opacity-0 transition-opacity  group-focus-within:opacity-100`}
        >
          {tracker.value}
        </div>
        <div
          className={`${animationDuration300} text-2xs col-start-1 row-start-1 min-h-[14.5px] max-w-[44px] overflow-clip text-nowrap text-center  opacity-100 transition-opacity  group-focus-within:opacity-0`}
        >
          {tracker.name}
        </div>
      </div>

      <div
        className={`${noBackground ? "" : getBackgroundColor(color)} h-[44px] w-[44px] rounded-2xl`}
      >
        {Input}
      </div>
    </div>
  );
}
