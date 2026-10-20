import { Tracker } from "../../trackerHelpersBasic";
import { parseContentForNumber } from "../../useTrackerStore";

export function updateTrackerField(
  trackers: Tracker[],
  trackerId: string,
  field: "value" | "max" | "name" | "color" | "checked",
  content: string | number | boolean,
) {
  const index = trackers.findIndex((item) => item.id === trackerId);
  const tracker = trackers[index];

  let value: string | number | boolean;
  if (
    field === "value" &&
    typeof content === "string" &&
    (tracker.variant === "value" ||
      tracker.variant === "value-max" ||
      tracker.variant === "counter")
  ) {
    value = parseContentForNumber(
      content,
      tracker.value,
      tracker.inlineMath !== false,
    );
  } else if (
    field === "max" &&
    typeof content === "string" &&
    tracker.variant === "value-max"
  ) {
    value = parseContentForNumber(
      content,
      tracker.max,
      tracker.inlineMath !== false,
    );
  } else {
    console.warn("Suspect tracker variant/filed/content combination.");
    value = content;
  }

  return [
    ...trackers.slice(0, index),
    {
      ...trackers[index],
      [field]: value,
    },
    ...trackers.slice(index + 1),
  ];
}
