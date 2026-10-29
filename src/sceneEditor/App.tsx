import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import Editor from "../editor/Editor";
import { useTrackersState } from "../state/useSelectionTrackers";
import { TrackersUpdate, UpdateState } from "../state/helpers/updateState";
import { EditorFallback } from "../editor/EditorFallback";
import { getLocalTrackers, setLocalTrackers } from "../loaclStorageTrackers";
import { getPluginId } from "../getPluginId";
import { useState } from "react";

export function App() {
  const { trackersState, trackersStateDispatch } = useTrackersState();
  const [browserTrackers, setBrowserTrackers] = useState(getLocalTrackers());

  const playerRole = trackersState.playerRole;
  const sceneIsReady = trackersState.sceneIsReady;
  const sceneTrackers = trackersState.sceneTrackers;
  const theme = trackersState.theme;

  if (theme === undefined) return <></>;

  let fallback = (
    <EditorFallback
      theme={theme}
      close={() => OBR.popover.close(getPluginId("scene-editor"))}
    />
  );
  if (playerRole === undefined) return fallback;
  if (sceneTrackers === undefined) return fallback;

  fallback = (
    <EditorFallback
      message="Could not find scene."
      theme={theme}
      close={() => OBR.popover.close(getPluginId("scene-editor"))}
    />
  );
  if (!sceneIsReady) return fallback;

  fallback = (
    <EditorFallback
      message="GM Access Required"
      theme={theme}
      close={() => OBR.popover.close(getPluginId("scene-editor"))}
    />
  );
  if (playerRole !== "GM") return fallback;

  const updateTrackers = (update: TrackersUpdate) => {
    UpdateState.sceneMetadata(
      update,
      trackersState.sceneMetadata,
      (sceneMetadata: Metadata) =>
        trackersStateDispatch({
          type: "handleSceneMetadata",
          sceneMetadata,
        }),
    );
  };

  return (
    <Editor
      playerRole={playerRole}
      title={"Scene Trackers"}
      trackers={sceneTrackers}
      updateTrackers={updateTrackers}
      theme={theme}
      actions={[
        {
          title: "Browser Trackers",
          buttons: [
            {
              text: "Insert",
              onClick: browserTrackers
                ? () => updateTrackers({ trackers: browserTrackers })
                : () => {},
              disabled: (browserTrackers?.length ?? 0) < 1,
            },
          ],
        },
      ]}
      onSave={() => {
        setLocalTrackers(sceneTrackers);
        setBrowserTrackers(sceneTrackers);
      }}
    />
  );
}
