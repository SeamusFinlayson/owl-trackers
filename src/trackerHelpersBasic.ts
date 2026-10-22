/////////////////////////////////////////////////////////////////////
// Tracker types
/////////////////////////////////////////////////////////////////////

import { Tracker, TrackerZod } from "./TrackerZod";

export function isTracker(
  potentialTracker: unknown,
): potentialTracker is Tracker {
  return TrackerZod.safeParse(potentialTracker).success;
}

/////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////

export const MAX_TRACKER_COUNT = 12;
export const TRACKER_METADATA_ID: string = "trackers";
export const HIDDEN_METADATA_ID: string = "hidden";

/////////////////////////////////////////////////////////////////////
// Tracker creation
/////////////////////////////////////////////////////////////////////

export const createColor = (
  trackers: Tracker[],
  variant: Tracker["variant"],
) => {
  const count = trackers.filter(
    (tracker) => tracker.variant === variant,
  ).length;

  if (variant === "value") return (5 + count * 2) % 9;
  if (variant === "counter") return (6 + count * 2) % 9;
  else if (variant === "value-max") return (2 + count * 4) % 9;
  return (2 + count * 2) % 9;
};

export const createId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const createBubble = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "value",
    color: createColor(trackers, "value"),
    value: 0,
  };
};

export const createCounter = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "counter",
    color: createColor(trackers, "counter"),
    inlineMath: false,
    value: 0,
  };
};

export const createBar = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "value-max",
    color: createColor(trackers, "value-max"),
    value: 0,
    max: 0,
  };
};

export const createCheckbox = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    variant: "checkbox",
    color: createColor(trackers, "checkbox"),
    checked: false,
  };
};
