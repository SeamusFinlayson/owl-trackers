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
  addTrackerBar,
  addTrackerBubble,
  getTrackersFromSelection,
  overwriteTrackers,
  toggleTrackersHidden,
  updateTrackerField,
} from "../trackerHelpersItem";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import MoreIcon from "../icons/MoreIcon";
import { Tracker, checkOccupiedSpaces } from "../trackerHelpersBasic";
import { getTrackersFromSceneMetadata } from "../trackerHelpersScene";
// import "./temp.css";

export default function TrackerMenu({
  initialHidden,
  initialTrackers,
  initialSceneTrackers,
}: {
  initialHidden: boolean;
  initialTrackers: Tracker[];
  initialSceneTrackers: Tracker[];
}): JSX.Element {
  const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(initialHidden);
  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);
  const [sceneTrackers, setSceneTrackers] =
    useState<Tracker[]>(initialSceneTrackers);

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

  useEffect(
    () =>
      OBR.scene.onMetadataChange((metadata) =>
        setSceneTrackers(getTrackersFromSceneMetadata(metadata)),
      ),
    [],
  );

  const generateInput = (tracker: Tracker): JSX.Element => {
    if (tracker.variant === "value") {
      return (
        <BubbleInput
          key={tracker.id}
          tracker={tracker}
          color={tracker.color}
          updateValueMetadata={(content: string) =>
            updateTrackerField(tracker.id, "value", content, setTrackers)
          }
        ></BubbleInput>
      );
    }
    return (
      <BarInput
        key={tracker.id}
        tracker={tracker}
        color={tracker.color}
        updateValueMetadata={(content: string) =>
          updateTrackerField(tracker.id, "value", content, setTrackers)
        }
        updateMaxMetadata={(content: string) =>
          updateTrackerField(tracker.id, "max", content, setTrackers)
        }
      ></BarInput>
    );
  };

  return (
    // <button className="box"></button>
    <div className={mode === "DARK" ? "dark" : ""}>
      <div
        className={`flex flex-col gap-2 ${checkOccupiedSpaces(trackers) % 4 === 1 ? "px-8" : "px-4"} py-1`}
      >
        <div className="flex flex-row justify-center self-center rounded-full bg-white/25 dark:bg-black/25">
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
        {trackers.length !== 0 ? (
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 rounded-xl bg-white/0">
            {trackers.map((tracker) => generateInput(tracker))}
          </div>
        ) : sceneTrackers.length !== 0 ? (
          <button
            className="self-center justify-self-center rounded-lg border-none bg-white/30 p-[6px] text-center text-text-primary no-underline hover:bg-white/20 dark:bg-black/15 dark:text-text-primary-dark dark:hover:bg-black/35"
            onClick={() => overwriteTrackers(sceneTrackers, setTrackers)}
          >
            Use scene trackers
          </button>
        ) : (
          <div className="self-center justify-self-center rounded-lg border-none p-[6px] text-center text-text-primary no-underline dark:text-text-primary-dark">
            Scene trackers not set
          </div>
        )}
      </div>
    </div>
  );
}
