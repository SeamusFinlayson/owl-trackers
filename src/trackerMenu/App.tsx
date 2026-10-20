import "../index.css";
import TrackerMenu from "./TrackerMenu.tsx";
import { useTrackersState } from "../state/useSelectionTrackers";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme.ts";
import { Item } from "@owlbear-rodeo/sdk";
import { ItemUpdate } from "../state/updateItems/ItemsUpdatesType.ts";
import { updateSceneItems } from "../state/updateItems/updateSceneItems.ts";
import { updateStateItems } from "../state/updateItems/updateStateItems.ts";

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

  const updateTrackers = (update: Omit<ItemUpdate, "itemId">) => {
    const updates = [{ itemId: selectedItem.id, ...update }];

    updateSceneItems(updates);
    updateStateItems(updates, trackersState.items, (items: Item[]) =>
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
