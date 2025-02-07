/////////////////////////////////////////////////////////////////////
// Tracker types
/////////////////////////////////////////////////////////////////////

export type Tracker =
  | {
      id: string;
      name: string;
      variant: "value";
      position: number;
      color: number;
      showOnMap: boolean;
      inlineMath: boolean;
      value: number;
    }
  | {
      id: string;
      name: string;
      variant: "value-max";
      position: number;
      color: number;
      showOnMap: boolean;
      inlineMath: boolean;
      value: number;
      max: number;
    };

export type TrackerVariant = "value" | "value-max";

export function isTracker(
  potentialTracker: unknown,
): potentialTracker is Tracker {
  const tracker = potentialTracker as Tracker;

  if (tracker.id === undefined) return false;
  if (typeof tracker.id !== "string") return false;

  if (tracker.name === undefined) return false;
  if (typeof tracker.name !== "string") return false;

  if (tracker.position === undefined) return false;
  if (typeof tracker.position !== "number") return false;

  if (tracker.color === undefined) return false;
  if (typeof tracker.color !== "number") return false;

  if (tracker.showOnMap === undefined) return false;
  if (typeof tracker.showOnMap !== "boolean") return false;

  if (tracker.inlineMath === undefined) return false;
  if (typeof tracker.inlineMath !== "boolean") return false;

  if (tracker.variant === undefined) return false;
  if (tracker.variant !== "value" && tracker.variant !== "value-max") {
    return false;
  }

  if (tracker.variant === "value") {
    if (tracker.value === undefined) return false;
    if (typeof tracker.value !== "number") return false;
  }

  if (tracker.variant === "value-max") {
    if (tracker.value === undefined) return false;
    if (typeof tracker.value !== "number") return false;
    if (tracker.max === undefined) return false;
    if (typeof tracker.max !== "number") return false;
  }
  return true;
}

/////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////

export const MAX_TRACKER_COUNT = 8;
export const MAX_BUBBLE_COUNT = MAX_TRACKER_COUNT;
export const MAX_BAR_COUNT = MAX_TRACKER_COUNT;
export const TRACKER_METADATA_ID: string = "trackers";
export const HIDDEN_METADATA_ID: string = "hidden";

/////////////////////////////////////////////////////////////////////
// Tracker creation
/////////////////////////////////////////////////////////////////////

export const createColor = (trackers: Tracker[], variant: TrackerVariant) => {
  let count = 0;
  trackers.forEach((tracker) => {
    if (tracker.variant === variant) count++;
  });
  if (variant === "value") {
    return (5 + count * 2) % 9;
  }
  return (2 + count * 4) % 9;
};

export const createId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const createPosition = (
  trackers: Tracker[],
  variant: TrackerVariant,
) => {
  return trackers.filter((tracker) => tracker.variant === variant).length;
};

export const createBubble = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    name: "",
    variant: "value",
    position: createPosition(trackers, "value"),
    showOnMap: true,
    inlineMath: true,
    color: createColor(trackers, "value"),
    value: 0,
  };
};

export const createBar = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    name: "",
    variant: "value-max",
    position: createPosition(trackers, "value-max"),
    showOnMap: true,
    inlineMath: true,
    color: createColor(trackers, "value-max"),
    value: 0,
    max: 0,
  };
};
