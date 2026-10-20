import { Item } from "@owlbear-rodeo/sdk";
import {
  HIDDEN_METADATA_ID,
  TRACKER_METADATA_ID,
} from "../../trackerHelpersBasic";
import { getPluginId } from "../../getPluginId";
import { ItemMetadataUpdate } from "./UpdatesType";

export function updateStateSceneItems(
  updates: ItemMetadataUpdate[],
  items: Item[],
  updateItems: (items: Item[]) => void,
) {
  updateItems(
    items.map((item) => {
      const update = updates.find((update) => update.itemId === item.id);
      if (!update) return item;
      if ("trackers" in update)
        item.metadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
      if ("hidden" in update)
        item.metadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;

      return item;
    }),
  );
}
