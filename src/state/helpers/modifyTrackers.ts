import {
  MAX_TRACKER_COUNT,
  createBubble,
  createCheckbox,
  createCounter,
  createBar,
} from "../../trackerHelpersBasic";
import { Tracker } from "../../TrackerZod";
import { parseContentForNumber } from "../../parseContentForNumber";

export const ModifyTrackers = {
  create: {
    checkbox: (trackers: Tracker[]) => {
      if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
      return {
        changed: true,
        trackers: [...trackers, createCheckbox(trackers)],
      };
    },
    bubble: (trackers: Tracker[]) => {
      if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
      return { changed: true, trackers: [...trackers, createBubble(trackers)] };
    },
    counter: (trackers: Tracker[]) => {
      if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
      return {
        changed: true,
        trackers: [...trackers, createCounter(trackers)],
      };
    },
    bar: (trackers: Tracker[]) => {
      if (trackers.length >= MAX_TRACKER_COUNT) return { changed: false };
      return { changed: true, trackers: [...trackers, createBar(trackers)] };
    },
  },
  update: {
    field: (
      trackers: Tracker[],
      trackerId: string,
      field: "value" | "max" | "name" | "color" | "checked",
      content: string | number | boolean,
    ) => {
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
        value = content;
      }

      return trackers.toSpliced(index, 1, {
        ...trackers[index],
        [field]: value,
      });
    },
  },
  toggle: {
    showOnMap: (trackers: Tracker[], trackerId: string) => {
      const index = trackers.findIndex((item) => item.id === trackerId);
      const showOnMap = trackers[index].showOnMap;
      return trackers.toSpliced(index, 1, {
        ...trackers[index],
        ["showOnMap"]: showOnMap === undefined ? false : !showOnMap,
      });
    },
    inlineMath: (trackers: Tracker[], trackerId: string) => {
      const index = trackers.findIndex((item) => item.id === trackerId);
      const inlineMath = trackers[index].inlineMath;
      return trackers.toSpliced(index, 1, {
        ...trackers[index],
        ["inlineMath"]: inlineMath === undefined ? false : !inlineMath,
      });
    },
  },
  delete: (trackers: Tracker[], trackerId: string) => {
    const index = trackers.findIndex((item) => item.id === trackerId);
    return trackers.toSpliced(index, 1);
  },
};
