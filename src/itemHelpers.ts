import OBR, { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";

export type Tracker =
  | {
      id: string;
      name: string;
      variant: "value";
      position: number;
      color: number;
      value: number;
    }
  | {
      id: string;
      name: string;
      variant: "value-max";
      position: number;
      color: number;
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
  if (tracker.variant === undefined) return false;
  if (tracker.variant !== "value" && tracker.variant !== "value-max")
    return false;
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

export const TRACKER_METADATA_ID: string = "trackers";
export const HIDDEN_METADATA_ID: string = "hidden";

export async function writeTrackersToItem(trackers: Tracker[]) {
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

export async function writeTrackersHiddenToItem(trackersHidden: boolean) {
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

export async function getMetadataFromItems(
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
