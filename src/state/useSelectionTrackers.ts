import { useEffect, useReducer } from "react";
import OBR, { Item, Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import { ReducerAction } from "./ReducerAction";
import { TrackersState } from "./TrackersStateType";
import { defaultSettings, defaultTrackersState } from "./defaultTrackersState";
import { SettingsZod } from "./SettingsZod";
import { getPluginId } from "../getPluginId";
import { Tracker } from "../trackerHelpersBasic";
import { getTrackersFromSceneMetadata } from "../trackerHelpersScene";
import {
  getTrackersFromItem,
  getTrackersHiddenFromItem,
} from "../trackerHelpersItem";

function getDerivedState(
  action: Partial<TrackersState>,
  state: TrackersState,
): Partial<TrackersState> {
  const derivedState: Partial<TrackersState> = {};

  if ("items" in action || "selection" in action) {
    const items = action.items ?? state.items;
    const selection = action.selection ?? state.selection;

    const selectedItem = items.find((item) => item.id === selection?.[0]);
    let selectionTrackers: Tracker[] = [];
    let trackersHidden = false;
    try {
      selectionTrackers = getTrackersFromItem(selectedItem as Item);
      trackersHidden = getTrackersHiddenFromItem(selectedItem as Item);
    } catch (e) {
      selectionTrackers = [];
    }

    derivedState.selectedItem = selectedItem;
    derivedState.selectionTrackers = selectionTrackers;
    derivedState.selectionTrackersHidden = trackersHidden;
  }

  if ("sceneMetadata" in action) {
    const sceneMetadata = action.sceneMetadata ?? state.sceneMetadata;
    derivedState.sceneTrackers = getTrackersFromSceneMetadata(sceneMetadata);
  }

  if ("roomMetadata" in action) {
    const roomMetadata = action.roomMetadata ?? state.roomMetadata;
    const parseResult = SettingsZod.safeParse(
      roomMetadata[getPluginId("settings")],
    );
    if (parseResult.success) {
      derivedState.setting = { ...defaultSettings, ...parseResult.data };
    }
  }

  return derivedState;
}

function reducer(state: TrackersState, action: ReducerAction): TrackersState {
  switch (action.type) {
    case "handleItemsChange": {
      return {
        ...state,
        items: action.items,
        ...getDerivedState(action, state),
      };
    }
    case "handleSelectionChange": {
      return {
        ...state,
        selection: action.selection,
        ...getDerivedState(action, state),
      };
    }
    case "handlePlayerRole": {
      return {
        ...state,
        playerRole: action.playerRole,
        ...getDerivedState(action, state),
      };
    }
    case "handleTheme": {
      return {
        ...state,
        theme: action.theme,
        ...getDerivedState(action, state),
      };
    }
    case "handleSceneMetadata": {
      return {
        ...state,
        sceneMetadata: action.sceneMetadata,
        ...getDerivedState(action, state),
      };
    }
    case "handleRoomMetadata": {
      return {
        ...state,
        roomMetadata: action.roomMetadata,
        ...getDerivedState(action, state),
      };
    }
    case "handleSceneReadyChange": {
      if (!action.sceneIsReady)
        return { ...defaultTrackersState, sceneIsReady: action.sceneIsReady };

      return {
        ...state,
        sceneIsReady: action.sceneIsReady,
        ...getDerivedState(action, state),
      };
    }
    default:
      throw new Error("Invalid reducer action type");
  }
}

export function useTrackersState() {
  const [trackersState, trackersStateDispatch] = useReducer(
    reducer,
    defaultTrackersState,
  );

  useEffect(() => {
    const handleItems = (items: Item[]) => {
      trackersStateDispatch({ type: "handleItemsChange", items });
    };
    OBR.scene.items.getItems().then(handleItems);
    return OBR.scene.items.onChange(handleItems);
  }, []);

  useEffect(() => {
    const handleSelection = (selection: Player["selection"] | undefined) => {
      trackersStateDispatch({ type: "handleSelectionChange", selection });
    };
    const handleRole = (playerRole: Player["role"] | undefined) => {
      trackersStateDispatch({ type: "handlePlayerRole", playerRole });
    };
    OBR.player.getSelection().then(handleSelection);
    OBR.player.getRole().then(handleRole);
    return OBR.player.onChange((player) => {
      (handleSelection(player.selection), handleRole(player.role));
    });
  }, []);

  useEffect(() => {
    const handleMetadata = (sceneMetadata: Metadata) => {
      trackersStateDispatch({ type: "handleSceneMetadata", sceneMetadata });
    };
    OBR.scene.getMetadata().then(handleMetadata);
    return OBR.scene.onMetadataChange(handleMetadata);
  }, []);

  useEffect(() => {
    const handleTheme = (theme: Theme) => {
      trackersStateDispatch({ type: "handleTheme", theme });
    };
    OBR.theme.getTheme().then(handleTheme);
    return OBR.theme.onChange(handleTheme);
  }, []);

  useEffect(() => {
    const handleSceneReady = (sceneIsReady: boolean) => {
      trackersStateDispatch({ type: "handleSceneReadyChange", sceneIsReady });
    };
    OBR.scene.isReady().then(handleSceneReady);
    return OBR.scene.onReadyChange(handleSceneReady);
  }, []);

  return { trackersState, trackersStateDispatch };
}
