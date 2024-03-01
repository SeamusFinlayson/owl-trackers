import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";
import { getTrackersFromSelection } from "../itemHelpers";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme";

OBR.onReady(async () => {
  const [OBRTheme, role, metadata] = await Promise.all([
    OBR.theme.getTheme(),
    OBR.player.getRole(),
    getTrackersFromSelection(),
    OBR.theme.getTheme(),
  ]);

  const [trackers, trackersHidden] = metadata;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider theme={getTheme(OBRTheme)}>
        <App
          initialMode={OBRTheme.mode}
          initialRole={role}
          initialTrackers={trackers}
          initialHidden={trackersHidden}
        />
      </ThemeProvider>
    </React.StrictMode>,
  );
});
