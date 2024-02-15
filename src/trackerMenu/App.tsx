import { useEffect, useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore";
import { useOwlbearStoreSync } from "../../useOwlbearStoreSync";
import "../index.css";
import BubbleInput from "./components/BubbleInput";
import IconButton from "./components/IconButton";
import AddIcon from "./components/AddIcon";
import AddSquareIcon from "./components/AddSquareIcon";
import EditIcon from "./components/EditIcon";
import VisibleIcon from "./components/VisibleIcon";
import NotVisibleIcon from "./components/NotVisibleIcon";
import IconToggle from "./components/IconToggle";
import BarInput from "./components/BarInput";
// import "./temp.css";

type stat =
  | {
      type: "value";
      color: number;
      value: number;
    }
  | {
      type: "value-max";
      color: number;
      value: number;
      max: number;
    };

export default function App({
  initialMode,
}: {
  initialMode: "DARK" | "LIGHT";
}): JSX.Element {
  useOwlbearStoreSync();

  const [bubbleCount, setBubbleCount] = useState(0);
  const [barCount, setBarCount] = useState(0);
  const incrementBubbleCount = () => {
    if (barCount * 2 + bubbleCount < 8) {
      setBubbleCount((prev) => prev + 1);
    }
  };
  const incrementBarCount = () => {
    if (barCount * 2 + bubbleCount < 7) {
      setBarCount((prev) => prev + 1);
    }
  };

  // Generate test data
  const trackers: stat[] = [];
  for (let i = 0; i < bubbleCount; i++) {
    const thisStat: stat = {
      type: "value",
      color: (i * 5 + 3) % 7,
      value: i * 6 + 3,
    };
    trackers.push(thisStat);
  }
  for (let i = 0; i < barCount; i++) {
    const thisStat: stat = {
      type: "value-max",
      color: (i * 2) % 7,
      value: i * 7 + 2,
      max: i * 7 + 5,
    };
    trackers.push(thisStat);
  }

  const generateInput = (tracker: stat): JSX.Element => {
    if (tracker.type === "value") {
      return (
        <BubbleInput
          color={tracker.color}
          inputProps={{ value: tracker.value, className: "bg-red" }}
        ></BubbleInput>
      );
    }
    return (
      <BarInput
        color={tracker.color}
        value={tracker.value}
        max={tracker.max}
      ></BarInput>
    );
  };

  const trackerBoxes: JSX.Element[] = [];
  trackers.forEach((tracker) => {
    trackerBoxes.push(generateInput(tracker));
  });

  // Prevent flash on startup
  const setMode = useOwlbearStore((state) => state.setMode);
  useEffect(() => setMode(initialMode));

  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(false);
  const toggleHidden = () => {
    setTrackersHidden((prev) => !prev);
  };

  return (
    // <button className="box"></button>
    <div className={mode === "DARK" ? "dark" : ""}>
      <div
        className={`flex flex-col gap-2 ${(bubbleCount + barCount * 2) % 4 === 1 ? "px-8" : "px-4"} py-1`}
      >
        <div className="flex flex-row justify-center self-center rounded-full bg-black/25">
          <IconButton
            Icon={AddIcon}
            onClick={incrementBubbleCount}
          ></IconButton>
          <IconButton
            Icon={AddSquareIcon}
            onClick={incrementBarCount}
          ></IconButton>
          <IconButton
            Icon={EditIcon}
            onClick={() => {
              setBubbleCount(0);
              setBarCount(0);
            }}
          ></IconButton>
          <IconButton
            Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
            onClick={toggleHidden}
          ></IconButton>
          {/* <IconToggle
            active={trackersHidden}
            onClick={updateTrackersHidden}
            ActiveIcon={NotVisibleIcon}
            InactiveIcon={VisibleIcon}
          ></IconToggle> */}
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 rounded-xl bg-white/0">
          {trackerBoxes}
        </div>
      </div>
    </div>
  );
}
