import OBR from "@owlbear-rodeo/sdk";
import {
  HIDDEN_METADATA_ID,
  TRACKER_METADATA_ID,
} from "../../trackerHelpersBasic";
import { getPluginId } from "../../getPluginId";
import { ItemUpdate } from "./ItemsUpdatesType";

export function updateSceneItems(updates: ItemUpdate[]) {
  const itemIds = updates.map((update) => update.itemId);

  OBR.scene.items.updateItems(itemIds, (items) => {
    items.forEach((item) => {
      const update = updates.find((update) => update.itemId === item.id);
      if (!update) throw new Error("Could not find item.");
      if ("trackers" in update)
        item.metadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
      if ("hidden" in update)
        item.metadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;
    });
  });
}
