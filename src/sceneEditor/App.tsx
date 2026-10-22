import { Metadata } from "@owlbear-rodeo/sdk";
import Editor from "../editor/Editor";
import { useTrackersState } from "../state/useSelectionTrackers";
import { TrackersUpdate, UpdateState } from "../state/helpers/updateState";
import { EditorFallback } from "../editor/EditorFallback";
import { getLocalTrackers, setLocalTrackers } from "../loaclStorageTrackers";

export function App() {
  const { trackersState, trackersStateDispatch } = useTrackersState();

  const playerRole = trackersState.playerRole;
  const sceneIsReady = trackersState.sceneIsReady;
  const sceneTrackers = trackersState.sceneTrackers;
  const theme = trackersState.theme;

  if (theme === undefined) return <></>;

  let fallback = <EditorFallback theme={theme} />;
  if (playerRole === undefined) return fallback;
  if (sceneTrackers === undefined) return fallback;

  fallback = <EditorFallback message="Could not find scene." theme={theme} />;
  if (!sceneIsReady) return fallback;

  fallback = <EditorFallback message="GM Access Required" theme={theme} />;
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
    if (update.trackers) setLocalTrackers(update.trackers);
  };

  const localTrackers = getLocalTrackers();

  return (
    <Editor
      playerRole={playerRole}
      title={"Scene Trackers"}
      trackers={sceneTrackers}
      updateTrackers={updateTrackers}
      theme={theme}
      actions={[
        {
          title: "Local Trackers",
          buttons: [
            {
              text: "Insert",
              onClick: localTrackers
                ? () => updateTrackers({ trackers: localTrackers })
                : () => {},
              disabled: (localTrackers?.length ?? 0) < 1,
            },
          ],
        },
      ]}
    />
  );
}
