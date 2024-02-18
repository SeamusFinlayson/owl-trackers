import { useEffect, useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore.ts";
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
  // toggleInlineMath,
  toggleShowOnMap,
  updateTrackerField,
} from "../itemHelpers.ts";
import OBR from "@owlbear-rodeo/sdk";
import NameInput from "../components/NameInput.tsx";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import { getPluginId } from "../getPluginId.ts";
import OnMap from "../icons/OnMap.tsx";
import NotOnMap from "../icons/NotOnMap.tsx";
// import MathIcon from "../icons/MathIcon.tsx";
// import "./temp.css";

export default function Editor({
  initialTrackers,
  initialHidden,
}: {
  initialTrackers: Tracker[];
  initialHidden: boolean;
}): JSX.Element {
  const role = useOwlbearStore((state) => state.role); // TODO: prevent flash from hide icon being added in second render
  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(initialHidden);
  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);

  useEffect(() => {
    if (trackersHidden && role === "PLAYER") {
      OBR.popover.close(getPluginId("editor"));
    }
  }, [trackersHidden, role]);

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
        className={`grid min-w-[170px] grow auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-2 rounded-lg bg-[#3d4051]/95 p-1 drop-shadow not-tiny:basis-1`}
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
        ></IconButton>

        <div className="col-span-2 flex w-full flex-row items-stretch justify-evenly">
          <ColorPicker
            setColorNumber={(content) =>
              updateTrackerField(tracker.id, "color", content, setTrackers)
            }
          ></ColorPicker>

          <div className="flex flex-col items-center justify-evenly">
            {tracker.variant === "value" ? (
              <BubbleInput
                key={tracker.id}
                valueControl={tracker.value}
                color={tracker.color}
                inputProps={{
                  // value: tracker.value,
                  // onChange: (e) =>
                  //   handleInputChange(tracker.id, "value", e.target.value),
                  onBlur: (e) =>
                    updateTrackerField(
                      tracker.id,
                      "value",
                      e.target.value,
                      setTrackers,
                    ),
                }}
              ></BubbleInput>
            ) : (
              <BarInput
                key={tracker.id}
                valueControl={tracker.value}
                maxControl={tracker.max}
                color={tracker.color}
                valueInputProps={{
                  onBlur: (e) =>
                    updateTrackerField(
                      tracker.id,
                      "value",
                      e.target.value,
                      setTrackers,
                    ),
                }}
                maxInputProps={{
                  onBlur: (e) =>
                    updateTrackerField(
                      tracker.id,
                      "max",
                      e.target.value,
                      setTrackers,
                    ),
                }}
              ></BarInput>
            )}
            <div className="flex flex-row justify-center self-center rounded-full bg-[#1e2231]/80">
              <IconButton
                Icon={tracker.showOnMap ? OnMap : NotOnMap}
                onClick={() => toggleShowOnMap(tracker.id, setTrackers)}
              ></IconButton>
              {/* <IconButton
                Icon={MathIcon}
                onClick={() => toggleInlineMath(tracker.id, setTrackers)}
              ></IconButton> */}
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

  return (
    // <button className="box"></button>
    <div className={mode === "DARK" ? "dark" : ""}>
      <div className={`flex flex-col gap-2 px-2 py-2`}>
        <div className="flex flex-row justify-center self-center rounded-full bg-[#1e2231]/80">
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
          ></IconButton>
        </div>
        <div className="flex min-w-[220px] flex-row flex-wrap justify-around gap-x-2 gap-y-2 rounded-xl bg-[#1e2231]/80 p-2">
          {trackers.map((tracker) => generateTrackerOptions(tracker))}
        </div>
      </div>
    </div>
  );
}
