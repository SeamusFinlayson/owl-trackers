import { getBackgroundColor } from "../colorHelpers";
import { Tracker } from "../TrackerZod";
import IconButton from "./IconButton";
import CheckedCircle from "../icons/CheckedCircle";
import UncheckedCircle from "../icons/UncheckedCircle";
import { cn } from "../lib/utils";

export default function CheckboxTrackerInput({
  tracker,
  color,
  updateHandler,
  animateOnlyWhenRootActive = false,
}: {
  tracker: Tracker;
  color: number;
  updateHandler: (checked: boolean) => void;
  animateOnlyWhenRootActive?: boolean;
}): React.JSX.Element {
  if (tracker.variant !== "checkbox")
    throw new Error("Expected checkbox tracker variant");

  const animationDuration300 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-300 group-hover/root:duration-300"
    : "duration-300";

  return (
    <div className="group text-text-primary dark:text-text-primary-dark">
      <div
        className={`${animationDuration300} text-2xs min-h-[14.5px] max-w-[44px] overflow-clip text-center text-nowrap`}
      >
        {tracker.name}
      </div>

      <div
        className={cn(
          getBackgroundColor(color),
          "flex h-[44px] w-[44px] items-center justify-center overflow-clip rounded-2xl",
        )}
      >
        <IconButton
          className="h-full w-full rounded-none"
          Icon={tracker.checked ? CheckedCircle : UncheckedCircle}
          onClick={() => updateHandler(!tracker.checked)}
        />
      </div>
    </div>
  );
}
