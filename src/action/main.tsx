import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";
import { OBRThemeProvider } from "../OBRThemeProvider";
import {
  BAR_HEIGHT_METADATA_ID,
  TRACKERS_ABOVE_METADATA_ID,
  VERTICAL_OFFSET_METADATA_ID,
  readBooleanFromMetadata,
  readNumberFromMetadata,
} from "../sceneMetadataHelpers";

OBR.onReady(async () => {
  const metadata = await OBR.scene.getMetadata();

  const initialVerticalOffset = readNumberFromMetadata(
    metadata,
    VERTICAL_OFFSET_METADATA_ID,
  );
  const initialTrackersAboveToken = readBooleanFromMetadata(
    metadata,
    TRACKERS_ABOVE_METADATA_ID,
  );
  const initialBarHeightIsReduced = readBooleanFromMetadata(
    metadata,
    BAR_HEIGHT_METADATA_ID,
  );

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <OBRThemeProvider>
        <App
          initialVerticalOffset={initialVerticalOffset}
          initialTrackersAboveToken={initialTrackersAboveToken}
          initialBarHeightIsReduced={initialBarHeightIsReduced}
        />
      </OBRThemeProvider>
    </React.StrictMode>,
  );
});
