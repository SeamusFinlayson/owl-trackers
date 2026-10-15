import { Item, Metadata } from "@owlbear-rodeo/sdk";
import { Tracker } from "../../trackerHelpersBasic";

export type TrackersState = {
  items: Item[];
  selection: string[] | undefined;
  selectedItem: Item | undefined;
  selectionTrackers: Tracker[];
  sceneMetadata: Metadata;
  sceneTrackers: Tracker[];
  sceneIsReady: boolean;
};
