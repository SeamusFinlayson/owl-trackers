import { useEffect, useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore.ts";
import "../index.css";
import BubbleInput from "../components/BubbleInput.tsx";
import IconButton from "../components/IconButton.tsx";
import AddIcon from "../icons/AddIcon.tsx";
import AddSquareIcon from "../icons/AddSquareIcon.tsx";
import BarInput from "../components/BarInput.tsx";
import {
  addTrackerBar,
  addTrackerBubble,
  deleteTracker,
  toggleShowOnMap,
  toggleInlineMath,
  getTrackersFromSceneMetadata,
  updateTrackerField,
} from "../trackerHelpersScene.ts";
import OBR from "@owlbear-rodeo/sdk";
import NameInput from "../components/NameInput.tsx";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import { getPluginId } from "../getPluginId.ts";
import OnMap from "../icons/OnMap.tsx";
import NotOnMap from "../icons/NotOnMap.tsx";
import MathIcon from "../icons/MathIcon.tsx";
import NoMathIcon from "../icons/NoMathIcon.tsx";
import { Tracker } from "../trackerHelpersBasic.ts";

export default function SceneEditor({
  initialTrackers,
}: {
  initialTrackers: Tracker[];
}): JSX.Element {
  // const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.mode);
  const role = useOwlbearStore((state) => state.role);

  if (role === "PLAYER") {
    OBR.popover.close(getPluginId("scene-editor"));
  }

  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);

  useEffect(
    () =>
      OBR.scene.onMetadataChange((metadata) =>
        setTrackers(getTrackersFromSceneMetadata(metadata)),
      ),
    [],
  );

  const trackerCountIsOdd = trackers.length % 2 === 1;

  return (
    // <button className="box"></button>
    <div className={`${mode === "DARK" ? "dark" : ""} over h-screen`}>
      <div className={`flex h-full flex-col gap-1.5 p-2`}>
        <div className="grid grid-cols-[auto,1fr] items-center gap-0 pl-2 pr-40">
          <h1 className="m-0 flex items-center justify-center justify-self-start text-lg tracking-[0px] text-text-primary dark:text-text-primary-dark">
            Set Scene Defaults
          </h1>
          <div className="flex w-max flex-row justify-center justify-self-center rounded-full bg-default dark:bg-default-dark/80">
            <IconButton
              Icon={AddIcon}
              onClick={() => addTrackerBubble(trackers, setTrackers)}
            ></IconButton>
            <IconButton
              Icon={AddSquareIcon}
              onClick={() => addTrackerBar(trackers, setTrackers)}
            ></IconButton>

            <IconButton
              Icon={DeleteIcon}
              onClick={() => OBR.popover.close(getPluginId("scene-editor"))}
              danger={true}
            ></IconButton>
          </div>
        </div>
        <div
          className={`flex h-full min-w-[220px] flex-row flex-wrap content-start justify-around gap-x-2 gap-y-2 overflow-y-auto rounded-xl bg-default p-2 dark:bg-default-dark ${trackerCountIsOdd ? "pb-0" : "pd-2"} not-tiny:pb-2`}
        >
          {trackers.map((tracker) =>
            generateTrackerOptions(tracker, setTrackers),
          )}
          {trackerCountIsOdd && (
            <div className="`grid min-w-[170px] grow auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-2 rounded-lg drop-shadow not-tiny:basis-1 not-tiny:p-1"></div>
          )}
        </div>
      </div>
    </div>
  );
}

const generateTrackerOptions = (
  tracker: Tracker,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>,
): JSX.Element => {
  return (
    <div
      key={tracker.id}
      className={`grid min-w-[170px] grow auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-4 rounded-lg bg-paper p-1 drop-shadow dark:bg-paper-dark/75 not-tiny:basis-1`}
    >
      <NameInput
        valueControl={tracker.name}
        inputProps={{
          onBlur: (e) =>
            updateTrackerField(tracker.id, "name", e.target.value, setTrackers),
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
              color={tracker.color}
              updateValueMetadata={(content: string) =>
                updateTrackerField(tracker.id, "value", content, setTrackers)
              }
            ></BubbleInput>
          ) : (
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
          )}
          <div className="flex flex-row justify-center self-center rounded-full bg-default dark:bg-default-dark/80">
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
    </div>
  );
};
