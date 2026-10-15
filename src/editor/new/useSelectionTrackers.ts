import { useEffect, useReducer } from "react";
import { Tracker } from "../../trackerHelpersBasic";
import OBR, { Item, Metadata } from "@owlbear-rodeo/sdk";
import { getTrackersFromItem } from "../../trackerHelpersItem";
import { getTrackersFromSceneMetadata } from "../../trackerHelpersScene";
import { ReducerAction } from "./ReducerAction";
import { TrackersState } from "./TrackersState";
import { defaultTrackersState } from "./defaultTrackersState";

/** Get trackers from selected item */
export function getDerivedState(
  items: Item[],
  selection: string[] | undefined,
  sceneMetadata: Metadata,
) {
  const selectedItem = items.find((item) => item.id === selection?.[0]);
  let selectionTrackers: Tracker[] = [];
  try {
    selectionTrackers = getTrackersFromItem(selectedItem as Item);
  } catch (e) {
    selectionTrackers = [];
  }

  const sceneTrackers = getTrackersFromSceneMetadata(sceneMetadata);

  return { selectedItem, selectionTrackers, sceneTrackers };
}

function reducer(state: TrackersState, action: ReducerAction): TrackersState {
  switch (action.type) {
    case "handleItemsChange": {
      return {
        ...state,
        items: action.items,
        ...getDerivedState(action.items, state.selection, state.sceneMetadata),
      };
    }
    case "handleSelectionChange": {
      return {
        ...state,
        selection: action.selection,
        ...getDerivedState(state.items, action.selection, state.sceneMetadata),
      };
    }
    case "handleSceneMetadata": {
      return {
        ...state,
        sceneMetadata: action.sceneMetadata,
        ...getDerivedState(state.items, state.selection, action.sceneMetadata),
      };
    }
    case "handleSceneReadyChange": {
      if (!action.sceneIsReady)
        return { ...defaultTrackersState, sceneIsReady: action.sceneIsReady };

      return {
        ...state,
        sceneIsReady: action.sceneIsReady,
        ...getDerivedState(state.items, state.selection, state.sceneMetadata),
      };
    }
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
    const handleSelection = (selection: string[] | undefined) => {
      trackersStateDispatch({ type: "handleSelectionChange", selection });
    };
    OBR.player.getSelection().then(handleSelection);
    OBR.player.onChange((player) => handleSelection(player.selection));
  }, []);

  useEffect(() => {
    const handleMetadata = (sceneMetadata: Metadata) => {
      trackersStateDispatch({ type: "handleSceneMetadata", sceneMetadata });
    };
    OBR.scene.getMetadata().then(handleMetadata);
    OBR.scene.onMetadataChange(handleMetadata);
  }, []);

  useEffect(() => {
    const handleSceneReady = (sceneIsReady: boolean) => {
      trackersStateDispatch({ type: "handleSceneReadyChange", sceneIsReady });
    };
    OBR.scene.isReady().then(handleSceneReady);
    OBR.scene.onReadyChange(handleSceneReady);
  }, []);

  return { trackersState, trackersStateDispatch };
}
