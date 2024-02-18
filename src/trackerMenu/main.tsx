import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";
import { getTrackersFromSelection } from "../itemHelpers";

OBR.onReady(async () => {
  const [theme, metadata] = await Promise.all([
    OBR.theme.getTheme(),
    getTrackersFromSelection(),
  ]);

  const [trackers, trackersHidden] = metadata;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App
        initialMode={theme.mode}
        initialTrackers={trackers}
        initialHidden={trackersHidden}
      />
    </React.StrictMode>,
  );
});
