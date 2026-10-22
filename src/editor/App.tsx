import "../index.css";
import Editor from "./Editor.tsx";
import { useTrackersState } from "../state/useSelectionTrackers.ts";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { TrackersUpdate, UpdateState } from "../state/helpers/updateState.ts";
import { EditorFallback } from "./EditorFallback.tsx";
import { openSceneTrackersPopover } from "../action/openSceneTrackersPopover.ts";
import { getPluginId } from "../getPluginId.ts";

export default function App(): React.JSX.Element {
  const { trackersState, trackersStateDispatch } = useTrackersState();

  const playerRole = trackersState.playerRole;
  const selectedItem = trackersState.selectedItem;
  const selectionTrackers = trackersState.selectionTrackers;
  const selectionTrackersHidden = trackersState.selectionTrackersHidden;
  const sceneTrackers = trackersState.sceneTrackers;
  const theme = trackersState.theme;

  if (theme === undefined) return <></>;

  let fallback = (
    <EditorFallback
      theme={theme}
      close={() => OBR.popover.close(getPluginId("editor"))}
    />
  );
  if (playerRole === undefined) return fallback;
  if (selectionTrackers === undefined) return fallback;
  if (selectionTrackersHidden === undefined) return fallback;
  if (sceneTrackers === undefined) return fallback;

  fallback = (
    <EditorFallback
      message="Could not find token."
      theme={theme}
      close={() => OBR.popover.close(getPluginId("editor"))}
    />
  );
  if (selectedItem === undefined) return fallback;

  fallback = (
    <EditorFallback
      message="GM Access Required"
      theme={theme}
      close={() => OBR.popover.close(getPluginId("editor"))}
    />
  );
  if (playerRole !== "GM" && selectionTrackersHidden) return fallback;

  const updateTrackers = (update: TrackersUpdate) => {
    const updates = [{ itemId: selectedItem.id, ...update }];

    UpdateState.items(updates, trackersState.items, (items: Item[]) =>
      trackersStateDispatch({
        type: "handleItemsChange",
        items,
      }),
    );
  };

  return (
    <Editor
      playerRole={playerRole}
      title={selectedItem?.name ?? ""}
      trackers={selectionTrackers}
      trackersHidden={selectionTrackersHidden}
      updateTrackers={updateTrackers}
      theme={theme}
      editName
      actions={[
        {
          title: "Scene Default Trackers",
          buttons: [
            {
              text: "Insert",
              onClick: () => {
                updateTrackers({ trackers: sceneTrackers });
              },
              disabled: sceneTrackers.length < 1,
            },
            {
              text: "Edit",
              onClick: openSceneTrackersPopover,
            },
          ],
        },
      ]}
    />
  );
}
