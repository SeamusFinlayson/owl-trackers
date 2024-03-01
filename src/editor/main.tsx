import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import { getTrackersFromSelection } from "../itemHelpers";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "../getTheme";

OBR.onReady(async () => {
  const [OBRtheme, role, metadata] = await Promise.all([
    OBR.theme.getTheme(),
    OBR.player.getRole(),
    getTrackersFromSelection(),
  ]);

  const [trackers, trackersHidden] = metadata;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider theme={getTheme(OBRtheme)}>
        <App
          initialMode={OBRtheme.mode}
          initialRole={role}
          initialTrackers={trackers}
          initialHidden={trackersHidden}
        />
      </ThemeProvider>
    </React.StrictMode>,
  );
});
