import {
  Tracker,
  MAX_TRACKER_COUNT,
  createBubble,
  createCheckbox,
  createCounter,
  createBar,
} from "../../trackerHelpersBasic";

export const createTracker = {
  checkbox: (trackers: Tracker[]) => {
    if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
    return { changed: true, trackers: [...trackers, createCheckbox(trackers)] };
  },
  bubble: (trackers: Tracker[]) => {
    if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
    return { changed: true, trackers: [...trackers, createBubble(trackers)] };
  },
  counter: (trackers: Tracker[]) => {
    if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
    return { changed: true, trackers: [...trackers, createCounter(trackers)] };
  },
  bar: (trackers: Tracker[]) => {
    if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
    return { changed: true, trackers: [...trackers, createBar(trackers)] };
  },
};
