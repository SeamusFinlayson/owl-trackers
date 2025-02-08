import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import { Tracker, isTracker, TRACKER_METADATA_ID } from "./trackerHelpersBasic";

/////////////////////////////////////////////////////////////////////
// Interacting with stored trackers in the scene
/////////////////////////////////////////////////////////////////////

/** Write local trackers to scene */
export async function writeTrackersToScene(trackers: Tracker[]) {
  OBR.scene.setMetadata({ [getPluginId(TRACKER_METADATA_ID)]: trackers });
}

/** Get trackers from scene */
export async function getTrackersFromScene(): Promise<Tracker[]> {
  const sceneMetadata = await OBR.scene.getMetadata();
  // console.log(sceneMetadata[getPluginId(TRACKER_METADATA_ID)]);

  if (typeof sceneMetadata === "undefined") {
    return [];
  }

  return getTrackersFromSceneMetadata(sceneMetadata);
}

export function getTrackersFromSceneMetadata(sceneMetadata: Metadata) {
  const trackers: Tracker[] = [];

  const trackersMetadata = sceneMetadata[getPluginId(TRACKER_METADATA_ID)];
  if (!trackersMetadata) return trackers;
  if (!Array.isArray(trackersMetadata)) {
    throw TypeError(`Expected an array, got ${typeof trackersMetadata}`);
  }

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
