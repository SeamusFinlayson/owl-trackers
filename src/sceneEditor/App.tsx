import { useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore.ts";
import { useOwlbearStoreSync } from "../useOwlbearStoreSync.ts";
import "../index.css";
import Editor from "./SceneEditor.tsx";
import { Tracker } from "../trackerHelpersBasic.ts";

export default function App({
  initialMode,
  initialRole,
  initialTrackers,
}: {
  initialMode: "DARK" | "LIGHT";
  initialRole: "PLAYER" | "GM";
  initialTrackers: Tracker[];
}): JSX.Element {
  useOwlbearStoreSync();

  const setRole = useOwlbearStore((state) => state.setRole);
  const setMode = useOwlbearStore((state) => state.setMode);

  // Prevent flash on startup
  const [initDone, setInitDone] = useState(false);
  if (!initDone) {
    setInitDone(true);
    setMode(initialMode);
    setRole(initialRole);
  }

  return <Editor initialTrackers={initialTrackers}></Editor>;
}
