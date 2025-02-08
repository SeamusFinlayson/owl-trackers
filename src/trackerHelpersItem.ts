import OBR, { Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";
import {
  isTracker,
  TRACKER_METADATA_ID,
  HIDDEN_METADATA_ID,
  Tracker,
} from "./trackerHelpersBasic";

/////////////////////////////////////////////////////////////////////
// Interacting with stored trackers in an item
/////////////////////////////////////////////////////////////////////

/** Write local trackers to selected item */
export async function writeTrackersToSelection(trackers: Tracker[]) {
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

/** Get trackers from selected item */
export async function getTrackersFromSelection(
  items?: Item[],
): Promise<Tracker[]> {
  if (items === undefined) items = await OBR.scene.items.getItems();

  const selection = await OBR.player.getSelection();
  const selectedItem = items.find((item) => item.id === selection?.[0]);
  if (selectedItem === undefined) throw TypeError;

  return getTrackersFromMetadata(selectedItem);
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

export function getTrackersHiddenFromItem(item: Item) {
  const trackersHidden = item.metadata[getPluginId(HIDDEN_METADATA_ID)];
  if (trackersHidden === undefined || typeof trackersHidden !== "boolean")
    return false;
  return trackersHidden;
}
