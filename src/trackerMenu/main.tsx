import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";
import { getTrackersFromSelection } from "../trackerHelpersItem";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme";
import { getTrackersFromScene } from "../trackerHelpersScene";

OBR.onReady(async () => {
  const [OBRTheme, role, [trackers, trackersHidden], sceneTrackers] =
    await Promise.all([
      OBR.theme.getTheme(),
      OBR.player.getRole(),
      getTrackersFromSelection(),
      // OBR.theme.getTheme(),
      getTrackersFromScene(),
    ]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider theme={getTheme(OBRTheme)}>
        <App
          initialMode={OBRTheme.mode}
          initialRole={role}
          initialHidden={trackersHidden}
          initialTrackers={trackers}
          initialSceneTrackers={sceneTrackers}
        />
      </ThemeProvider>
    </React.StrictMode>,
  );
});
