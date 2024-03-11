import OBR, { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import {
  isTracker,
  createBubble,
  createBar,
  TRACKER_METADATA_ID,
  HIDDEN_METADATA_ID,
  Tracker,
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

/** Update trackers and:
 * * Guarantee address mutation of trackers so trackers can be used as react state.
 * * Guarantee order of trackers is based on placement variable and tracker type.
 * * Guarantee modifications are written to the OBR item. */
const updateTrackers = (
  applyUpdate: (prevTrackers: Tracker[]) => void,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  setTrackers((prev) => {
    const draftTrackers = [...prev];
    applyUpdate(draftTrackers);

    const sortedTrackers = sortTrackers(draftTrackers);

    const validatedTrackers: Tracker[] = [];
    sortedTrackers.forEach((tracker) => {
      if (!isTracker(tracker)) {
        console.log("Invalid tracker detected: ", tracker);
      } else {
        validatedTrackers.push(tracker);
      }
    });

    writeTrackersToSelection(validatedTrackers);
    return validatedTrackers;
  });
};

export const overwriteTrackers = (
  trackers: Tracker[],
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  updateTrackers((prevTrackers) => {
    prevTrackers.splice(0, prevTrackers.length, ...trackers);
  }, setTrackers);
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

export const toggleTrackersHidden = (
  setTrackersHidden: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setTrackersHidden((prev) => {
    const value = !prev;
    writeTrackersHiddenToSelection(value);
    return value;
  });
};

/////////////////////////////////////////////////////////////////////
// Interacting with stored trackers in an item
/////////////////////////////////////////////////////////////////////

/** Write local trackers to selected item */
async function writeTrackersToSelection(trackers: Tracker[]) {
  const selection = await OBR.player.getSelection();
  const selectedItems = await OBR.scene.items.getItems(selection);

  if (typeof selection === "undefined" || selection.length !== 1) {
    throw `Error: Player has selected ${selection?.length} items selected, expected 1.`;
  }

  OBR.scene.items.updateItems(selectedItems, (items) => {
    for (const item of items) {
      item.metadata[getPluginId(TRACKER_METADATA_ID)] = trackers;
    }
  });
}

/** Write local trackers hidden state to selected item */
async function writeTrackersHiddenToSelection(trackersHidden: boolean) {
  const selection = await OBR.player.getSelection();
  const selectedItems = await OBR.scene.items.getItems(selection);

  if (typeof selection === "undefined" || selection.length !== 1) {
    throw `Error: Player has selected ${selection?.length} items selected, expected 1.`;
  }

  OBR.scene.items.updateItems(selectedItems, (items) => {
    for (const item of items) {
      item.metadata[getPluginId(HIDDEN_METADATA_ID)] = trackersHidden;
    }
  });
}

/** Get trackers from selected item */
export async function getTrackersFromSelection(
  items?: Item[],
): Promise<[Tracker[], boolean]> {
  if (items === undefined) {
    items = await OBR.scene.items.getItems();
  }

  const selection = await OBR.player.getSelection();
  if (selection === undefined) throw TypeError;

  const selectedItem = items.find((item) => item.id === selection[0]);
  if (selectedItem === undefined) throw TypeError;

  if (typeof selection === "undefined" || selection.length !== 1) {
    throw `Error: Player has selected ${selection?.length} items selected, expected 1.`;
  }

  return [
    getTrackersFromMetadata(selectedItem),
    getTrackersHiddenFromItem(selectedItem),
  ];
}

export function getTrackersFromItem(item: Item): [Tracker[], boolean] {
  return [getTrackersFromMetadata(item), getTrackersHiddenFromItem(item)];
}

function getTrackersFromMetadata(item: Item) {
  const trackers: Tracker[] = [];

  const metadata = item.metadata[getPluginId(TRACKER_METADATA_ID)];
  if (!metadata) return trackers;
  if (!Array.isArray(metadata)) {
    throw TypeError(`Expected an array, got ${typeof metadata}`);
  }

  for (const tracker of metadata) {
    if (!isTracker(tracker)) {
      console.log(
        "Invalid tracker detected and ignored, see contents below:",
        tracker,
      );
    } else {
      trackers.push(tracker);
    }
  }

  return trackers;
}

function getTrackersHiddenFromItem(item: Item) {
  let trackersHidden = false;

  const metadata = item.metadata[getPluginId(HIDDEN_METADATA_ID)];
  if (!metadata || typeof metadata !== "boolean") return trackersHidden;
  trackersHidden = metadata;

  return trackersHidden;
}
