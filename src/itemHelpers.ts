import OBR, { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";

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

function isTracker(potentialTracker: unknown): potentialTracker is Tracker {
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

const randomColor = () => {
  return Math.floor(Math.random() * 6);
};

const createId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const createPosition = (trackers: Tracker[], variant: TrackerVariant) => {
  return trackers.filter((tracker) => tracker.variant === variant).length;
};

const createBubble = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    name: "",
    variant: "value",
    position: createPosition(trackers, "value"),
    showOnMap: true,
    inlineMath: true,
    color: randomColor(),
    value: 0,
  };
};

const createBar = (trackers: Tracker[]): Tracker => {
  return {
    id: createId(),
    name: "",
    variant: "value-max",
    position: createPosition(trackers, "value-max"),
    showOnMap: true,
    inlineMath: true,
    color: randomColor(),
    value: 0,
    max: 0,
  };
};

export const checkOccupiedSpaces = (trackers: Tracker[]) => {
  let spaces = 0;
  for (const tracker of trackers) {
    if (tracker.variant === "value") {
      spaces += 1;
    } else {
      spaces += 2;
    }
  }
  return spaces;
};

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

    writeTrackersToItem(sortedTrackers);
    return sortedTrackers;
  });
};

export const updateTrackerField = (
  id: string,
  field: "value" | "max" | "name" | "color",
  content: string | number,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  if ((field === "value" || field === "max") && typeof content === "string") {
    content = Math.trunc(parseFloat(content));
    if (isNaN(content)) content = 0;
  }
  updateTrackers((prevTrackers) => {
    const index = prevTrackers.findIndex((item) => item.id === id);
    prevTrackers.splice(index, 1, {
      ...prevTrackers[index],
      [field]: content,
    });
  }, setTrackers);
};

export const MAX_BUBBLE_COUNT = 8;
export const MAX_BAR_COUNT = 4;

export const addTrackerBubble = (
  trackers: Tracker[],
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  if (checkOccupiedSpaces(trackers) < 8) {
    updateTrackers((prev) => prev.push(createBubble(trackers)), setTrackers);
  }
};

export const addTrackerBar = (
  trackers: Tracker[],
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
) => {
  if (checkOccupiedSpaces(trackers) < 7) {
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
    writeTrackersHiddenToItem(value);
    return value;
  });
};

export const TRACKER_METADATA_ID: string = "trackers";
export const HIDDEN_METADATA_ID: string = "hidden";

async function writeTrackersToItem(trackers: Tracker[]) {
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

async function writeTrackersHiddenToItem(trackersHidden: boolean) {
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
      console.log(tracker);
      throw TypeError(`Expected a Tracker, got ${typeof tracker}`);
    }
    trackers.push(tracker);
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
