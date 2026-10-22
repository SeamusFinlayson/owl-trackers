import OBR, { Item, Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../getPluginId";
import {
  TRACKER_METADATA_ID,
  HIDDEN_METADATA_ID,
} from "../../trackerHelpersBasic";
import { Tracker } from "../../TrackerZod";
import { Settings } from "../SettingsZod";
import { debouncerFactory } from "./debouncerFactory";

export type TrackersUpdate = {
  trackers?: Tracker[];
  hidden?: boolean;
  name?: string;
};

export type ItemTrackersUpdate = {
  itemId: string;
} & TrackersUpdate;

export type SettingsUpdate = {
  settings?: Settings;
};

const itemsDebouncer = debouncerFactory(200);
const sceneMetadataDebouncer = debouncerFactory(200);
const roomMetadataDebouncer = debouncerFactory(200);

export const UpdateState = {
  items: (
    updates: ItemTrackersUpdate[],
    items: Item[],
    updateItems: (items: Item[]) => void,
  ) => {
    const itemIds = updates.map((update) => update.itemId);

    const sendUpdate = () =>
      OBR.scene.items.updateItems(itemIds, (items) => {
        items.forEach((item) => {
          const update = updates.find((update) => update.itemId === item.id);
          if (!update) throw new Error("Could not find item.");
          if ("trackers" in update)
            item.metadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
          if ("hidden" in update)
            item.metadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;
          if ("name" in update && update.name) item.name = update.name;
        });
      });
    itemsDebouncer.debounce(sendUpdate);

    updateItems(
      items.map((item) => {
        const update = updates.find((update) => update.itemId === item.id);
        if (!update) return item;
        if ("trackers" in update)
          item.metadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
        if ("hidden" in update)
          item.metadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;
        if ("name" in update && update.name) item.name = update.name;

        return item;
      }),
    );
  },

  sceneMetadata: (
    update: TrackersUpdate,
    metadata: Metadata,
    updateMetadata: (metadata: Metadata) => void,
  ) => {
    const newMetadata: Metadata = { ...metadata };

    if ("trackers" in update)
      newMetadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
    if ("hidden" in update)
      newMetadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;

    const sendUpdate = () => OBR.scene.setMetadata(newMetadata);
    sceneMetadataDebouncer.debounce(sendUpdate);

    updateMetadata(newMetadata);
  },

  roomMetadata: (
    update: SettingsUpdate,
    metadata: Metadata,
    updateMetadata: (metadata: Metadata) => void,
  ) => {
    const newMetadata: Metadata = { ...metadata };

    if ("settings" in update)
      newMetadata[getPluginId("settings")] = update.settings;

    const sendUpdate = () => OBR.room.setMetadata(newMetadata);
    roomMetadataDebouncer.debounce(sendUpdate);

    updateMetadata(newMetadata);
  },
};
