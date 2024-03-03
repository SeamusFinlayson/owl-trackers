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
  addTrackerBar,
  addTrackerBubble,
  deleteTracker,
  getTrackersFromSelection,
  toggleTrackersHidden,
  toggleShowOnMap,
  updateTrackerField,
  toggleInlineMath,
  overwriteTrackers,
} from "../trackerHelpersItem.ts";
import OBR from "@owlbear-rodeo/sdk";
import NameInput from "../components/NameInput.tsx";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import { getPluginId } from "../getPluginId.ts";
import OnMap from "../icons/OnMap.tsx";
import NotOnMap from "../icons/NotOnMap.tsx";
import MathIcon from "../icons/MathIcon.tsx";
import NoMathIcon from "../icons/NoMathIcon.tsx";
import { Tooltip } from "@mui/material";
import { Tracker } from "../trackerHelpersBasic.ts";
import { getTrackersFromSceneMetadata } from "../trackerHelpersScene.ts";

export default function Editor({
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

  useEffect(
    () =>
      OBR.scene.onMetadataChange((metadata) =>
        setSceneTrackers(getTrackersFromSceneMetadata(metadata)),
      ),
    [],
  );

  const generateTrackerOptions = (tracker: Tracker): JSX.Element => {
    return (
      <div
        key={tracker.id}
        className={`grid auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-4 rounded-lg bg-paper p-1 drop-shadow dark:bg-paper-dark/75`}
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

        <Tooltip title={"Delete"} placement="top">
          <div>
            <IconButton
              Icon={DeleteIcon}
              onClick={() => deleteTracker(tracker.id, setTrackers)}
              rounded="rounded-md"
              padding=""
              danger={true}
            ></IconButton>
          </div>
        </Tooltip>

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
              <Tooltip
                title={tracker.showOnMap ? "Hide From Map" : "Show on Map"}
              >
                <div className="rounded-full">
                  <IconButton
                    Icon={tracker.showOnMap ? OnMap : NotOnMap}
                    onClick={() => toggleShowOnMap(tracker.id, setTrackers)}
                  ></IconButton>
                </div>
              </Tooltip>
              <Tooltip
                title={tracker.inlineMath ? "Disable Math" : "Enable Math"}
              >
                <div className="rounded-full">
                  <IconButton
                    Icon={tracker.inlineMath ? MathIcon : NoMathIcon}
                    onClick={() => toggleInlineMath(tracker.id, setTrackers)}
                  ></IconButton>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      <div className={`flex h-full flex-col gap-1.5 p-2`}>
        <div className="flex flex-row justify-center self-center rounded-full bg-default dark:bg-default-dark/80">
          <Tooltip title={"Add Tracker"}>
            <div className="rounded-full">
              <IconButton
                Icon={AddIcon}
                onClick={() => addTrackerBubble(trackers, setTrackers)}
              ></IconButton>
            </div>
          </Tooltip>
          <Tooltip title={"Add Bar Tracker"}>
            <div className="rounded-full">
              <IconButton
                Icon={AddSquareIcon}
                onClick={() => addTrackerBar(trackers, setTrackers)}
              ></IconButton>
            </div>
          </Tooltip>
          {role === "GM" && (
            <Tooltip title={trackersHidden ? "Show Trackers" : "Hide Trackers"}>
              <div className="rounded-full">
                <IconButton
                  Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
                  onClick={() => toggleTrackersHidden(setTrackersHidden)}
                ></IconButton>
              </div>
            </Tooltip>
          )}
          <Tooltip title={"Close Editor"}>
            <div className="rounded-full">
              <IconButton
                Icon={DeleteIcon}
                onClick={() => OBR.popover.close(getPluginId("editor"))}
                danger={true}
              ></IconButton>
            </div>
          </Tooltip>
        </div>
        <div
          className={`flex h-full w-full min-w-[220px] flex-col items-center justify-start overflow-y-auto rounded-xl bg-default p-2 dark:bg-default-dark`}
        >
          {trackers.length !== 0 ? (
            <div className="grid grid-cols-1 gap-x-2 gap-y-2 not-tiny:grid-cols-2">
              {trackers.map((tracker) => generateTrackerOptions(tracker))}
            </div>
          ) : sceneTrackers.length !== 0 ? (
            <button
              className="rounded-lg border-none bg-paper/90 p-[6px] text-center text-text-primary no-underline hover:bg-paper/55 dark:bg-paper-dark/70 dark:text-text-primary-dark dark:hover:bg-paper-dark/50"
              onClick={() => overwriteTrackers(sceneTrackers, setTrackers)}
            >
              Use scene trackers
            </button>
          ) : (
            <div className="rounded-lg border-none p-[6px] text-center text-text-secondary no-underline dark:text-text-secondary-dark">
              Scene trackers not set
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
