import { useEffect, useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore";
import { useOwlbearStoreSync } from "../../useOwlbearStoreSync";
import "../index.css";
import BubbleInput from "./components/BubbleInput";
import IconButton from "./components/IconButton";

export default function App({
  initialMode,
}: {
  initialMode: "DARK" | "LIGHT";
}): JSX.Element {
  useOwlbearStoreSync();

  // Prevent flash on startup
  const setMode = useOwlbearStore((state) => state.setMode);
  useEffect(() => setMode(initialMode));

  const mode = useOwlbearStore((state) => state.mode);

  const [count, setCount] = useState(0);

  return (
    <div className={mode === "DARK" ? "dark" : ""}>
      <div className="grid grid-cols-4 place-items-center gap-2 bg-white/5 px-2 py-1">
        <BubbleInput color=""></BubbleInput>
        <BubbleInput color=""></BubbleInput>
        <BubbleInput color=""></BubbleInput>
        <BubbleInput color=""></BubbleInput>
        <BubbleInput color=""></BubbleInput>
        <IconButton></IconButton>
      </div>
    </div>
  );
}
