import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import {
  Tracker,
  isTracker,
  createBubble,
  createBar,
  TRACKER_METADATA_ID,
  MAX_TRACKER_COUNT,
} from "./trackerHelpersBasic";

/////////////////////////////////////////////////////////////////////
// Updating trackers
/////////////////////////////////////////////////////////////////////

const sortTrackers = (trackers: Tracker[]): Tracker[] => {
  const sortedTrackers: Tracker[] = [];

  for (const variant of ["value", "value-max"]) {
    sortedTrackers.push(
      ...trackers
        .filter((value) => value.variant === variant)
        .sort((a, b) => a.position - b.position)
        .map((tracker, index) => {
          return { ...tracker, ["position"]: index };
        }),
    );
  }

  return sortedTrackers;
};

const updateTrackers = (
  updateFunction: (prevTrackers: Tracker[]) => void,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  setTrackers((prev) => {
    const draftTrackers = [...prev];
    updateFunction(draftTrackers);

    const sortedTrackers = sortTrackers(draftTrackers);

    const validatedTrackers: Tracker[] = [];
    sortedTrackers.forEach((tracker) => {
      if (!isTracker(tracker)) {
        console.log("Invalid tracker detected: ", tracker);
      } else {
        validatedTrackers.push(tracker);
      }
    });

    writeTrackersToScene(validatedTrackers);
    return validatedTrackers;
  });
};

export const updateTrackerField = (
  id: string,
  field: "value" | "max" | "name" | "color",
  content: string | number,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  updateTrackers((prevTrackers) => {
    const index = prevTrackers.findIndex((item) => item.id === id);
    const tracker = prevTrackers[index];

    if ((field === "value" || field === "max") && typeof content === "string") {
      if (
        tracker.inlineMath &&
        (content.startsWith("+") || content.startsWith("-"))
      ) {
        let prevValue = 0;
        if (tracker.variant === "value-max" && field === "max") {
          prevValue = tracker.max;
        } else {
          prevValue = tracker.value;
        }
        content = Math.trunc(prevValue + Math.trunc(parseFloat(content)));
      } else {
        content = Math.trunc(parseFloat(content));
        if (isNaN(content)) content = 0;
      }
    }

    // console.log(content);

    prevTrackers.splice(index, 1, {
      ...prevTrackers[index],
      [field]: content,
    });
  }, setTrackers);
};

export const addTrackerBubble = (
  trackers: Tracker[],
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  if (trackers.length < MAX_TRACKER_COUNT) {
    updateTrackers((prev) => prev.push(createBubble(trackers)), setTrackers);
  }
};

export const addTrackerBar = (
  trackers: Tracker[],
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  if (trackers.length < MAX_TRACKER_COUNT) {
    updateTrackers((prev) => prev.push(createBar(trackers)), setTrackers);
  }
};

export const deleteTracker = (
  id: string,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  updateTrackers((prevTrackers) => {
    const index = prevTrackers.findIndex((item) => item.id === id);
    prevTrackers.splice(index, 1);
  }, setTrackers);
};

export const toggleShowOnMap = (
  id: string,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  updateTrackers((prevTrackers) => {
    const index = prevTrackers.findIndex((item) => item.id === id);
    prevTrackers.splice(index, 1, {
      ...prevTrackers[index],
      ["showOnMap"]: !prevTrackers[index].showOnMap,
    });
  }, setTrackers);
};

export const toggleInlineMath = (
  id: string,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  updateTrackers((prevTrackers) => {
    const index = prevTrackers.findIndex((item) => item.id === id);
    prevTrackers.splice(index, 1, {
      ...prevTrackers[index],
      ["inlineMath"]: !prevTrackers[index].inlineMath,
    });
  }, setTrackers);
};

/////////////////////////////////////////////////////////////////////
// Interacting with stored trackers in the scene
/////////////////////////////////////////////////////////////////////

/** Write local trackers to scene */
async function writeTrackersToScene(trackers: Tracker[]) {
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
