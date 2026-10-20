import { getPluginId } from "../getPluginId.ts";
import "../index.css";
import Editor from "./Editor.tsx";
import { useTrackersState } from "../state/useSelectionTrackers.ts";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { Button, ThemeProvider } from "@mui/material";
import { MetadataUpdate } from "../state/updateItems/UpdatesType.ts";
import { updateSceneItems } from "../state/updateItems/updateSceneItems.ts";
import { updateStateSceneItems } from "../state/updateItems/updateStateSceneItems.ts";
import { getTheme } from "../getTheme.ts";

export type EditorAppConfig = { type: "scene" } | { type: "item" };

export default function App(): React.JSX.Element {
  const { trackersState, trackersStateDispatch } = useTrackersState();

  const playerRole = trackersState.playerRole;
  const selectedItem = trackersState.selectedItem;
  const selectionTrackers = trackersState.selectionTrackers;
  const selectionTrackersHidden = trackersState.selectionTrackersHidden;
  const sceneTrackers = trackersState.sceneTrackers;
  const theme = trackersState.theme;

  if (playerRole === undefined) return <></>;
  if (selectedItem === undefined) return <></>;
  if (selectionTrackers === undefined) return <></>;
  if (selectionTrackersHidden === undefined) return <></>;
  if (sceneTrackers === undefined) return <></>;
  if (theme === undefined) return <></>;

  const updateTrackers = (update: MetadataUpdate) => {
    const updates = [{ itemId: selectedItem.id, ...update }];

    updateSceneItems(updates);
    updateStateSceneItems(updates, trackersState.items, (items: Item[]) =>
      trackersStateDispatch({
        type: "handleItemsChange",
        items,
      }),
    );
  };

  return (
    <div className={`${theme.mode === "DARK" ? "dark" : ""} over h-screen`}>
      <ThemeProvider theme={getTheme(theme)}>
        <div className="bg-default dark:bg-default-dark flex h-full flex-col">
          {selectedItem ? (
            <Editor
              playerRole={playerRole}
              title={selectedItem?.name ?? ""}
              trackers={selectionTrackers}
              trackersHidden={selectionTrackersHidden}
              autofillTrackers={sceneTrackers}
              updateTrackers={updateTrackers}
            />
          ) : (
            <div className="flex h-full flex-col p-4">
              <div className="grow">Could not find token.</div>
              <Button
                variant="outlined"
                onClick={() => OBR.popover.close(getPluginId("editor"))}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </ThemeProvider>
    </div>
  );
}
