import { TrackersState } from "./TrackersStateType";

export type ReducerAction =
  | { type: "handleItemsChange"; items: TrackersState["items"] }
  | {
      type: "handleSelectionChange";
      selection: TrackersState["selection"];
    }
  | {
      type: "handleSceneMetadata";
      sceneMetadata: TrackersState["sceneMetadata"];
    }
  | { type: "handleRoomMetadata"; roomMetadata: TrackersState["roomMetadata"] }
  | { type: "handlePlayerRole"; playerRole: TrackersState["playerRole"] }
  | { type: "handleTheme"; theme: TrackersState["theme"] }
  | {
      type: "handleSceneReadyChange";
      sceneIsReady: TrackersState["sceneIsReady"];
    };
