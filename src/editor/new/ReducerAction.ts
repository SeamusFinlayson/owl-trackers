import { Item, Metadata } from "@owlbear-rodeo/sdk";

export type ReducerAction =
  | { type: "handleItemsChange"; items: Item[] }
  | {
      type: "handleSelectionChange";
      selection: string[] | undefined;
    }
  | { type: "handleSceneMetadata"; sceneMetadata: Metadata }
  | { type: "handleSceneReadyChange"; sceneIsReady: boolean };
