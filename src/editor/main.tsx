import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import { getMetadataFromItems } from "../itemHelpers";
import App from "./App";

OBR.onReady(async () => {
  const [theme, role, metadata] = await Promise.all([
    OBR.theme.getTheme(),
    OBR.player.getRole(),
    getMetadataFromItems(),
  ]);

  const [trackers, trackersHidden] = metadata;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App
        initialMode={theme.mode}
        initialRole={role}
        initialTrackers={trackers}
        initialHidden={trackersHidden}
      />
    </React.StrictMode>,
  );
});
