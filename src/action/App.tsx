import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import { Action } from "./Action.tsx";
import { useTrackersState } from "../state/useSelectionTrackers.ts";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme.ts";
import { UpdateState } from "../state/helpers/updateState.ts";
import { Settings } from "../state/SettingsZod.ts";
import { cn } from "../lib/utils.ts";
import ReportBugButton from "../components/ReportBugButton.tsx";
import ActionHeader from "./ActionHeader.tsx";
import HeightMatch from "../components/HeightMatch.tsx";

export default function App(): React.JSX.Element {
  const { trackersState, trackersStateDispatch } = useTrackersState();

  if (trackersState.theme === undefined) return <></>;

  const updateSettings = (modifiedSettings: Partial<Settings>) => {
    const settings = { ...trackersState.settings, ...modifiedSettings };
    UpdateState.roomMetadata(
      { settings },
      trackersState.roomMetadata,
      (roomMetadata: Metadata) =>
        trackersStateDispatch({ type: "handleRoomMetadata", roomMetadata }),
    );
  };

  return (
    <ThemeProvider theme={getTheme(trackersState.theme)}>
      <div
        className={cn("h-screen overflow-y-auto", {
          dark: trackersState.theme.mode === "DARK",
        })}
      >
        <HeightMatch setHeight={(height) => OBR.action.setHeight(height)}>
          {trackersState.playerRole === "GM" ? (
            <Action
              items={trackersState.items}
              roomMetadata={trackersState.roomMetadata}
              settings={trackersState.settings}
              updateSettings={updateSettings}
            />
          ) : (
            <div>
              <ActionHeader border />
              <h2 className="text-text-secondary dark:text-text-secondary-dark justify-self-start px-4 py-3 text-sm">
                Must have GM access to configure settings.
              </h2>
              <ReportBugButton />
            </div>
          )}
        </HeightMatch>
      </div>
    </ThemeProvider>
  );
}
