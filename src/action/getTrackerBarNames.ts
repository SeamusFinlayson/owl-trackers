import OBR, { Item } from "@owlbear-rodeo/sdk";
import { getTrackersFromItem } from "../trackerHelpersItem";
import { useEffect, useState } from "react";

export function useTrackerBarNames() {
  const [trackerBarNames, setTrackerBarNames] = useState<string[]>([]);

  useEffect(() => {
    const getTrackerBarNames = (items: Item[]) => {
      const trackerBarNames = new Set<string>();
      for (const item of items) {
        const trackers = getTrackersFromItem(item);
        for (const tracker of trackers) {
          if (tracker.variant === "value-max" && tracker.name !== undefined)
            trackerBarNames.add(tracker.name);
        }
      }

      setTrackerBarNames([...trackerBarNames]);
    };

    OBR.scene.items.getItems().then(getTrackerBarNames);
    return OBR.scene.items.onChange(getTrackerBarNames);
  }, []);

  return trackerBarNames;
}
