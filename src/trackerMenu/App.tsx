import { useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore";
import { useOwlbearStoreSync } from "../../useOwlbearStoreSync";
import "../index.css";
import { Tracker } from "../itemHelpers";
import TrackerMenu from "./TrackerMenu.tsx";

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
    <TrackerMenu
      initialTrackers={initialTrackers}
      initialHidden={initialHidden}
    ></TrackerMenu>
  );
}
