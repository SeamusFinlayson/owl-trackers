import { useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore.ts";
import { useOwlbearStoreSync } from "../useOwlbearStoreSync.ts";
import "../index.css";
import Editor from "./Editor.tsx";
import { Tracker } from "../trackerHelpersBasic.ts";

export default function App({
  initialMode,
  initialRole,
  initialHidden,
  initialTrackers,
  initialSceneTrackers,
}: {
  initialMode: "DARK" | "LIGHT";
  initialRole: "PLAYER" | "GM";
  initialHidden: boolean;
  initialTrackers: Tracker[];
  initialSceneTrackers: Tracker[];
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

  return (
    <Editor
      initialHidden={initialHidden}
      initialTrackers={initialTrackers}
      initialSceneTrackers={initialSceneTrackers}
    ></Editor>
  );
}
