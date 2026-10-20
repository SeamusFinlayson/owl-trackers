import { ThemeProvider } from "@emotion/react";
import { Metadata } from "@owlbear-rodeo/sdk";
import Editor from "../editor/Editor";
import { getTheme } from "../getTheme";
import { useTrackersState } from "../state/useSelectionTrackers";
import { TrackersUpdate, UpdateState } from "../state/helpers/updateState";

export function App() {
  const { trackersState, trackersStateDispatch } = useTrackersState();

  const playerRole = trackersState.playerRole;
  const sceneTrackers = trackersState.sceneTrackers;
  const theme = trackersState.theme;

  if (playerRole === undefined) return <></>;
  if (sceneTrackers === undefined) return <></>;
  if (theme === undefined) return <></>;

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
    <div className={`${theme.mode === "DARK" ? "dark" : ""} over h-screen`}>
      <ThemeProvider theme={getTheme(theme)}>
        <div className="bg-default dark:bg-default-dark flex h-full flex-col">
          <Editor
            playerRole={playerRole}
            title={"Scene Trackers"}
            trackers={sceneTrackers}
            autofillTrackers={[]}
            updateTrackers={updateTrackers}
          />
        </div>
      </ThemeProvider>
    </div>
  );
}
