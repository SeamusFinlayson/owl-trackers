import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { PluginGate } from "../state/PluginGate";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PluginGate>
      <App />
    </PluginGate>
  </React.StrictMode>,
);
