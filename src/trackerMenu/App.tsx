import "../index.css";
import TrackerMenu from "./TrackerMenu.tsx";
import { useTrackersState } from "../state/useSelectionTrackers";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme.ts";
import { Item } from "@owlbear-rodeo/sdk";
import { updateSceneItems } from "../state/updateItems/updateSceneItems.ts";
import { updateStateSceneItems } from "../state/updateItems/updateStateSceneItems.ts";
import { MetadataUpdate } from "../state/updateItems/UpdatesType.ts";

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
    <div
      className={`${theme.mode === "DARK" ? "dark" : ""} h-screen overflow-y-auto`}
    >
      <ThemeProvider theme={getTheme(theme)}>
        <TrackerMenu
          playerRole={playerRole}
          selectionTrackers={selectionTrackers}
          selectionTrackersHidden={selectionTrackersHidden}
          sceneTrackers={sceneTrackers}
          updateTrackers={updateTrackers}
        />
      </ThemeProvider>
    </div>
  );
}
