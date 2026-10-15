import { useEffect, useState } from "react";
import { Tracker } from "../trackerHelpersBasic";
import OBR, { Item } from "@owlbear-rodeo/sdk";

export function useSelectionTrackers() {
  const selectionTrackers = useState<Tracker[]>();

  useEffect(() => {
    const handleItems = (items: Item[]) => {};
    OBR.scene.items.getItems().then(handleItems);
    return OBR.scene.items.onChange(handleItems);
  }, []);
}
