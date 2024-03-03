import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import { getTrackersFromSelection } from "../trackerHelpersItem";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme";
import { getTrackersFromScene } from "../trackerHelpersScene";

OBR.onReady(async () => {
  const [OBRtheme, role, [trackers, trackersHidden], sceneTrackers] =
    await Promise.all([
      OBR.theme.getTheme(),
      OBR.player.getRole(),
      getTrackersFromSelection(),
      getTrackersFromScene(),
    ]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider theme={getTheme(OBRtheme)}>
        <App
          initialMode={OBRtheme.mode}
          initialRole={role}
          initialHidden={trackersHidden}
          initialTrackers={trackers}
          initialSceneTrackers={sceneTrackers}
        />
      </ThemeProvider>
    </React.StrictMode>,
  );
});
