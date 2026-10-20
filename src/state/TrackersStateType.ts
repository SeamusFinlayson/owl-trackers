import { Item, Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import { Settings } from "./SettingsZod";
import { Tracker } from "../trackerHelpersBasic";

export type TrackersState = {
  sceneIsReady: boolean;
  items: Item[];
  selection: Player["selection"] | undefined;
  sceneMetadata: Metadata;
  roomMetadata: Metadata;
  playerRole: Player["role"] | undefined;
  theme: Theme | undefined;

  selectedItem: Item | undefined;
  selectionTrackers: Tracker[] | undefined;
  selectionTrackersHidden: boolean | undefined;
  sceneTrackers: Tracker[] | undefined;
  setting: Settings;
};
