import { useEffect, useState } from "react";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { HIDDEN_METADATA_ID } from "./trackerHelpersBasic";
import { getPluginId } from "./getPluginId";
import { getTrackersHiddenFromItem } from "./trackerHelpersItem";

export const useTrackersHidden = (): {
  value: boolean | undefined;
  toggle: () => void;
} => {
  const [trackersHidden, setTrackersHidden] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const updateTrackers = (items: Item[]) => {
      getTrackersHiddenFromSelection(items).then((val) => {
        setTrackersHidden(val);
      });
    };

    OBR.scene.items.getItems().then(updateTrackers);
    return OBR.scene.items.onChange(updateTrackers);
  }, []);

  const toggleTrackersHidden = () => {
    if (typeof trackersHidden === "boolean") {
      setTrackersHidden((prev) => {
        writeTrackersHiddenToSelection(!prev);
        return !prev;
      });
    } else {
      setTrackersHidden((prev) => {
        writeTrackersHiddenToSelection(!prev);
        return !prev;
      });
    }
  };

  return { value: trackersHidden, toggle: toggleTrackersHidden };
};

async function getTrackersHiddenFromSelection(items: Item[]): Promise<boolean> {
  const selection = await OBR.player.getSelection();
  const selectedItem = items.find((item) => item.id === selection?.[0]);

  if (selectedItem === undefined)
    throw new Error("Could not find selected item");

  return getTrackersHiddenFromItem(selectedItem);
}

/** Write local trackers hidden state to selected item */
async function writeTrackersHiddenToSelection(trackersHidden: boolean) {
  const selection = await OBR.player.getSelection();
  const selectedItems = await OBR.scene.items.getItems(selection);

  if (selection === undefined || selection.length !== 1) {
    throw `Error: Player has selected ${selection?.length} items selected, expected 1.`;
  }

  OBR.scene.items.updateItems(selectedItems, (items) => {
    for (const item of items) {
      item.metadata[getPluginId(HIDDEN_METADATA_ID)] = trackersHidden;
    }
  });
}
