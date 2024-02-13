import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";

OBR.onReady(async () => {
  const theme = await OBR.theme.getTheme();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App initialMode={theme.mode} />
    </React.StrictMode>
  );
});
