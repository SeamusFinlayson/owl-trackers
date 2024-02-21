import { useEffect, useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore";
import "../index.css";
import BubbleInput from "../components/BubbleInput";
import IconButton from "../components/IconButton";
import AddIcon from "../icons/AddIcon";
import AddSquareIcon from "../icons/AddSquareIcon";
import VisibleIcon from "../icons/VisibleIcon";
import NotVisibleIcon from "../icons/NotVisibleIcon";
import BarInput from "../components/BarInput";
import {
  Tracker,
  addTrackerBar,
  addTrackerBubble,
  checkOccupiedSpaces,
  getTrackersFromSelection,
  toggleTrackersHidden,
} from "../itemHelpers";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import MoreIcon from "../icons/MoreIcon";
// import "./temp.css";

export default function TrackerMenu({
  initialHidden,
  initialTrackers,
}: {
  initialTrackers: Tracker[];
  initialHidden: boolean;
}): JSX.Element {
  const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(initialHidden);
  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);

  useEffect(
    () =>
      OBR.scene.items.onChange((items) =>
        getTrackersFromSelection(items).then(
          ([newTracker, newTrackersHidden]) => {
            setTrackers(newTracker);
            setTrackersHidden(newTrackersHidden);
          },
        ),
      ),
    [],
  );

  const generateInput = (tracker: Tracker): JSX.Element => {
    if (tracker.variant === "value") {
      return (
        <BubbleInput
          key={tracker.id}
          tracker={tracker}
          setTrackers={setTrackers}
          color={tracker.color}
        ></BubbleInput>
      );
    }
    return (
      <BarInput
        key={tracker.id}
        tracker={tracker}
        setTrackers={setTrackers}
        color={tracker.color}
      ></BarInput>
    );
  };

  return (
    // <button className="box"></button>
    <div className={mode === "DARK" ? "dark" : ""}>
      <div
        className={`flex flex-col gap-2 ${checkOccupiedSpaces(trackers) % 4 === 1 ? "px-8" : "px-4"} py-1`}
      >
        <div className="flex flex-row justify-center self-center rounded-full bg-black/25">
          <IconButton
            Icon={AddIcon}
            onClick={() => addTrackerBubble(trackers, setTrackers)}
          ></IconButton>
          <IconButton
            Icon={AddSquareIcon}
            onClick={() => addTrackerBar(trackers, setTrackers)}
          ></IconButton>
          {role === "GM" && (
            <IconButton
              Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
              onClick={() => toggleTrackersHidden(setTrackersHidden)}
            ></IconButton>
          )}
          <IconButton
            Icon={MoreIcon}
            onClick={() => {
              OBR.popover.open({
                id: getPluginId("editor"),
                url: "/src/editor/editor.html",
                height: 600,
                width: 500,
                anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
                transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
              });
            }}
          ></IconButton>
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 rounded-xl bg-white/0">
          {trackers.map((tracker) => generateInput(tracker))}
        </div>
      </div>
    </div>
  );
}
