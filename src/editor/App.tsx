import { useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore";
import { useOwlbearStoreSync } from "../../useOwlbearStoreSync";
import "../index.css";
import { Tracker } from "../itemHelpers.ts";
import Editor from "./Editor.tsx";

export default function App({
  initialMode,
  initialRole,
  initialTrackers,
  initialHidden,
}: {
  initialMode: "DARK" | "LIGHT";
  initialRole: "PLAYER" | "GM";
  initialTrackers: Tracker[];
  initialHidden: boolean;
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
      initialTrackers={initialTrackers}
      initialHidden={initialHidden}
    ></Editor>
  );
}
