import { create } from "zustand";
import {
  Tracker,
  createBubble,
  createBar,
  MAX_TRACKER_COUNT,
} from "./trackerHelpersBasic";

interface TrackerState {
  trackers: Tracker[];
  writeToSaveLocation: ((trackers: Tracker[]) => Promise<void>) | undefined;

  setTrackers: (trackers: Tracker[]) => void;
  setWriteToSaveLocation: (
    writeToSaveLocation: (trackers: Tracker[]) => Promise<void>,
  ) => void;

  overWriteTrackers: (trackers: Tracker[]) => void;
  updateTrackerField: (
    id: string,
    field: "value" | "max" | "name" | "color",
    content: string | number,
  ) => void;
  addTrackerBubble: () => void;
  addTrackerBar: () => void;
  deleteTracker: (trackerId: string) => void;
  toggleShowOnMap: (trackerId: string) => void;
  toggleInlineMath: (trackerId: string) => void;
}

export const useTrackerStore = create<TrackerState>()((set) => ({
  trackers: [],
  writeToSaveLocation: undefined,

  setTrackers: (trackers) => set((state) => ({ ...state, trackers })),
  setWriteToSaveLocation: (writeToSaveLocation) =>
    set((state) => ({ ...state, writeToSaveLocation })),

  // Updates trackers locally and in the save location
  overWriteTrackers: (trackers) =>
    set((state) => {
      state.trackers = trackers;
      sideEffects(state);
      return { ...state };
    }),
  updateTrackerField: (trackerId, field, content) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      const tracker = state.trackers[index];

      if (field === "value" && typeof content === "string") {
        content = inlineMath(content, tracker.value, tracker.inlineMath);
      } else if (
        field === "max" &&
        typeof content === "string" &&
        tracker.variant === "value-max"
      ) {
        content = inlineMath(content, tracker.max, tracker.inlineMath);
      }

      state.trackers.splice(index, 1, {
        ...state.trackers[index],
        [field]: content,
      });
      sideEffects(state);
      return { ...state };
    }),
  addTrackerBubble: () =>
    set((state) => {
      if (state.trackers.length < MAX_TRACKER_COUNT) {
        state.trackers.push(createBubble(state.trackers));
      }
      sideEffects(state);
      return { ...state };
    }),
  addTrackerBar: () =>
    set((state) => {
      if (state.trackers.length < MAX_TRACKER_COUNT) {
        state.trackers.push(createBar(state.trackers));
      }
      sideEffects(state);
      return { ...state };
    }),
  deleteTracker: (trackerId) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      state.trackers.splice(index, 1);
      sideEffects(state);
      return { ...state };
    }),
  toggleShowOnMap: (trackerId) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      state.trackers.splice(index, 1, {
        ...state.trackers[index],
        ["showOnMap"]: !state.trackers[index].showOnMap,
      });
      sideEffects(state);
      return { ...state };
    }),
  toggleInlineMath: (trackerId) =>
    set((state) => {
      const index = state.trackers.findIndex((item) => item.id === trackerId);
      state.trackers.splice(index, 1, {
        ...state.trackers[index],
        ["inlineMath"]: !state.trackers[index].inlineMath,
      });
      sideEffects(state);
      return { ...state };
    }),
}));

function sideEffects(state: TrackerState) {
  // Sort trackers
  const sortedTrackers: Tracker[] = [];
  for (const variant of ["value", "value-max"]) {
    sortedTrackers.push(
      ...state.trackers
        .filter((value) => value.variant === variant)
        .sort((a, b) => a.position - b.position)
        .map((tracker, index) => {
          return { ...tracker, ["position"]: index };
        }),
    );
  }
  state.trackers = sortedTrackers;

  // Update trackers in the location they are stored
  if (state.writeToSaveLocation === undefined)
    throw new Error("Write to save location is undefined");
  state.writeToSaveLocation(state.trackers);
}

function inlineMath(
  inputContent: string,
  previousValue: number,
  doInlineMath = true,
): number {
  if (inputContent.startsWith("=")) {
    inputContent = inputContent.substring(1).trim();
    doInlineMath = false;
  }

  const newValue = parseFloat(inputContent);

  if (Number.isNaN(newValue)) return 0;
  if (
    doInlineMath &&
    (inputContent.startsWith("+") || inputContent.startsWith("-"))
  ) {
    return Math.trunc(previousValue + Math.trunc(newValue));
  }

  return newValue;
}
