import { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import { isTracker, TRACKER_METADATA_ID } from "./trackerHelpersBasic";
import { Tracker } from "./TrackerZod";

export function getTrackersFromSceneMetadata(sceneMetadata: Metadata) {
  const trackersMetadata = sceneMetadata[getPluginId(TRACKER_METADATA_ID)];
  if (trackersMetadata === undefined) return [];
  if (!Array.isArray(trackersMetadata)) {
    console.error(`Expected an array, got ${typeof trackersMetadata}`);
    return [];
  }

  const trackers: Tracker[] = [];
  for (const tracker of trackersMetadata) {
    if (!isTracker(tracker)) {
      console.log(
        "Invalid tracker detected, tracker was deleted, see contents below: ",
        tracker,
      );
    } else {
      trackers.push(tracker);
    }
  }

  return trackers;
}
