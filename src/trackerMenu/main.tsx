import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import App from "./App";
import { PluginGate } from "../state/PluginGate";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PluginGate>
      <App />
    </PluginGate>
  </React.StrictMode>,
);
