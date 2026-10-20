import { useEffect } from "react";
import { getPluginId } from "../getPluginId.ts";
import "../index.css";
import { Tracker, TRACKER_METADATA_ID } from "../trackerHelpersBasic.ts";
import { writeTrackersToSelection } from "../trackerHelpersItem.ts";
import Editor from "./Editor.tsx";
import { useTrackersState } from "../state/useSelectionTrackers.ts";
import OBR from "@owlbear-rodeo/sdk";
import { Button } from "@mui/material";

export type EditorAppConfig = { type: "scene" } | { type: "item" };

export default function App({
  initialMode,
  initialRole,
  editorProps,
}: {
  initialMode: "DARK" | "LIGHT";
  initialRole: "PLAYER" | "GM";
  editorProps: EditorAppConfig;
}): React.JSX.Element {
  const { trackersState, trackersStateDispatch } = useTrackersState();

  const updateTrackers = (trackers: Tracker[]) => {
    writeTrackersToSelection(trackers);
    const modifiedItem = trackersState.selectedItem;
    if (!modifiedItem) return;
    modifiedItem.metadata[getPluginId(TRACKER_METADATA_ID)] = trackers;
    trackersStateDispatch({
      type: "handleItemsChange",
      items: [
        ...trackersState.items.map((item) =>
          item.id === trackersState.selectedItem?.id ? modifiedItem : item,
        ),
      ],
    });
  };

  return (
    <div className={`${initialMode === "DARK" ? "dark" : ""} over h-screen`}>
      <div className="bg-default dark:bg-default-dark flex h-full flex-col">
        {trackersState.selectedItem ? (
          <Editor
            playerRole={initialRole}
            title={trackersState.selectedItem?.name ?? ""}
            trackers={trackersState.selectionTrackers}
            autofillTrackers={trackersState.sceneTrackers}
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
    </div>
  );
}
