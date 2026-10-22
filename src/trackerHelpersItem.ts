import { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import {
  isTracker,
  TRACKER_METADATA_ID,
  HIDDEN_METADATA_ID,
} from "./trackerHelpersBasic";
import { Tracker } from "./TrackerZod";

export function getTrackersFromItem(item: Item) {
  const metadata = item.metadata[getPluginId(TRACKER_METADATA_ID)];
  if (metadata === undefined) return [];
  if (!Array.isArray(metadata)) {
    throw TypeError(`Expected an array, got ${typeof metadata}`);
  }

  const trackers: Tracker[] = [];
  for (const tracker of metadata) {
    if (!isTracker(tracker)) {
      console.warn(
        "Invalid tracker detected and ignored, see contents below:",
        tracker,
      );
    } else {
      trackers.push(tracker);
    }
  }

  return trackers;
}

export function getTrackersHiddenFromItem(item: Item) {
  const trackersHidden = item.metadata[getPluginId(HIDDEN_METADATA_ID)];
  if (trackersHidden === undefined || typeof trackersHidden !== "boolean")
    return false;
  return trackersHidden;
}
