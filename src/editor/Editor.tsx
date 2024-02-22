import { useEffect, useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore.ts";
import "../index.css";
import BubbleInput from "../components/BubbleInput.tsx";
import IconButton from "../components/IconButton.tsx";
import AddIcon from "../icons/AddIcon.tsx";
import AddSquareIcon from "../icons/AddSquareIcon.tsx";
import VisibleIcon from "../icons/VisibleIcon.tsx";
import NotVisibleIcon from "../icons/NotVisibleIcon.tsx";
import BarInput from "../components/BarInput.tsx";
import {
  Tracker,
  addTrackerBar,
  addTrackerBubble,
  deleteTracker,
  getTrackersFromSelection,
  toggleTrackersHidden,
  toggleShowOnMap,
  updateTrackerField,
  toggleInlineMath,
} from "../itemHelpers.ts";
import OBR from "@owlbear-rodeo/sdk";
import NameInput from "../components/NameInput.tsx";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import { getPluginId } from "../getPluginId.ts";
import OnMap from "../icons/OnMap.tsx";
import NotOnMap from "../icons/NotOnMap.tsx";
import MathIcon from "../icons/MathIcon.tsx";
import NoMathIcon from "../icons/NoMathIcon.tsx";

export default function Editor({
  initialTrackers,
  initialHidden,
}: {
  initialTrackers: Tracker[];
  initialHidden: boolean;
}): JSX.Element {
  const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(initialHidden);
  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);

  if (trackersHidden && role === "PLAYER") {
    OBR.popover.close(getPluginId("editor"));
  }

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

  const generateTrackerOptions = (tracker: Tracker): JSX.Element => {
    return (
      <div
        key={tracker.id}
        className={`bg-paper dark:bg-paper-dark/75 grid min-w-[170px] grow auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-4 rounded-lg p-1 drop-shadow not-tiny:basis-1`}
      >
        <NameInput
          valueControl={tracker.name}
          inputProps={{
            onBlur: (e) =>
              updateTrackerField(
                tracker.id,
                "name",
                e.target.value,
                setTrackers,
              ),
          }}
        ></NameInput>

        <IconButton
          Icon={DeleteIcon}
          onClick={() => deleteTracker(tracker.id, setTrackers)}
          rounded="rounded-md"
          padding=""
          danger={true}
        ></IconButton>

        <div className="col-span-2 flex w-full flex-row items-center justify-evenly gap-x-1">
          <ColorPicker
            setColorNumber={(content) =>
              updateTrackerField(tracker.id, "color", content, setTrackers)
            }
          ></ColorPicker>

          <div className="flex min-w-[100px] flex-col items-center justify-evenly gap-2 py-1">
            {tracker.variant === "value" ? (
              <BubbleInput
                key={tracker.id}
                tracker={tracker}
                setTrackers={setTrackers}
                color={tracker.color}
              ></BubbleInput>
            ) : (
              <BarInput
                key={tracker.id}
                tracker={tracker}
                setTrackers={setTrackers}
                color={tracker.color}
              ></BarInput>
            )}
            <div className="bg-default dark:bg-default-dark/80 flex flex-row justify-center self-center rounded-full">
              <IconButton
                Icon={tracker.showOnMap ? OnMap : NotOnMap}
                onClick={() => toggleShowOnMap(tracker.id, setTrackers)}
              ></IconButton>
              <IconButton
                Icon={tracker.inlineMath ? MathIcon : NoMathIcon}
                onClick={() => toggleInlineMath(tracker.id, setTrackers)}
              ></IconButton>
            </div>
          </div>
        </div>

        {/* <div className="col-span-2 flex w-full justify-stretch">
          
        </div> */}
        {/* <div className="col-start-1 col-end-1"></div>
        <div className="col-span-1 col-start-1"></div>

        <div className="col-start-2 row-span-2 row-start-2 flex w-full justify-center"></div> */}

        {/* <div className="col-span-2 flex w-full items-center justify-evenly"></div> */}
      </div>
    );
  };

  const trackerCountIsOdd = trackers.length % 2 === 1;

  // const [color, setColor] = useState("#000");
  // OBR.theme.getTheme().then((value) => setColor(value.background.default));

  return (
    // <button className="box"></button>
    <div className={`${mode === "DARK" ? "dark" : ""} over h-screen`}>
      {/* <div
        style={{
          height: 30,
          width: 30,
          backgroundColor: color,
          position: "absolute",
        }}
      ></div> */}
      <div className={`flex h-full flex-col gap-2 p-2`}>
        <div className="bg-default dark:bg-default-dark/80 flex flex-row justify-center self-center rounded-full">
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
            Icon={DeleteIcon}
            onClick={() => OBR.popover.close(getPluginId("editor"))}
            danger={true}
          ></IconButton>
        </div>
        <div
          className={`bg-default dark:bg-default-dark flex h-full min-w-[220px] flex-row flex-wrap content-start justify-around gap-x-2 gap-y-2 overflow-y-auto rounded-xl p-2 ${trackerCountIsOdd ? "pb-0" : "pd-2"} not-tiny:pb-2`}
        >
          {trackers.map((tracker) => generateTrackerOptions(tracker))}
          {trackerCountIsOdd && (
            <div className="`grid min-w-[170px] grow auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-2 rounded-lg drop-shadow not-tiny:basis-1 not-tiny:p-1"></div>
          )}
        </div>
      </div>
    </div>
  );
}
