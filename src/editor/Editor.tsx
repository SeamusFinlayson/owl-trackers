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
import OBR, { Item, Metadata } from "@owlbear-rodeo/sdk";
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
import EditOffIcon from "../icons/EditOffIcon.tsx";
import EditIcon from "../icons/EditIcon.tsx";
import Palette from "../icons/Palette.tsx";
import SimplePopover from "../components/SimplePopover.tsx";

export default function Editor(): JSX.Element {
  const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(false);
  const [initDone, setInitDone] = useState<{
    trackers: boolean;
    sceneTrackers: boolean;
  }>({ trackers: false, sceneTrackers: false });
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [sceneTrackers, setSceneTrackers] = useState<Tracker[]>([]);

  const [editing, setEditing] = useState(false);

  if (trackersHidden && role === "PLAYER") {
    OBR.popover.close(getPluginId("editor"));
  }

  useEffect(() => {
    const updateTrackers = (items: Item[]) =>
      getTrackersFromSelection(items).then(
        ([newTracker, newTrackersHidden]) => {
          setTrackers(newTracker);
          setTrackersHidden(newTrackersHidden);
        },
      );
    OBR.scene.items
      .getItems()
      .then(updateTrackers)
      .then(() => setInitDone((prev) => ({ ...prev, trackers: true })));
    return OBR.scene.items.onChange(updateTrackers);
  }, []);

  useEffect(() => {
    const updateSceneTrackers = (metadata: Metadata) =>
      setSceneTrackers(getTrackersFromSceneMetadata(metadata));
    OBR.scene
      .getMetadata()
      .then(updateSceneTrackers)
      .then(() => setInitDone((prev) => ({ ...prev, sceneTrackers: true })));

    return OBR.scene.onMetadataChange(updateSceneTrackers);
  }, []);

  if (!initDone.trackers || !initDone.sceneTrackers) return <></>;

  return (
    <div className={`${mode === "DARK" ? "dark" : ""} over h-screen`}>
      <div className={`flex h-full flex-col bg-default  dark:bg-default-dark`}>
        <div className="grid w-full grid-cols-3 bg-paper p-1 pb-0.5 shadow dark:bg-paper-dark/55">
          <div>
            {role === "GM" && (
              <Tooltip
                title={trackersHidden ? "Show Trackers" : "Hide Trackers"}
              >
                <div className="w-fit rounded-full">
                  <IconButton
                    Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
                    onClick={() => toggleTrackersHidden(setTrackersHidden)}
                  />
                </div>
              </Tooltip>
            )}
          </div>
          <div className="flex justify-self-center">
            <Tooltip title={"Add Tracker"}>
              <div className="rounded-full">
                <IconButton
                  Icon={AddIcon}
                  onClick={() => addTrackerBubble(trackers, setTrackers)}
                />
              </div>
            </Tooltip>
            <Tooltip title={"Add Bar Tracker"}>
              <div className="rounded-full">
                <IconButton
                  Icon={AddSquareIcon}
                  onClick={() => addTrackerBar(trackers, setTrackers)}
                />
              </div>
            </Tooltip>
          </div>
          <div className="justify-self-end">
            <Tooltip title={"Toggle Edit Mode"} placement="bottom-end">
              <div className="rounded-full">
                <IconButton
                  Icon={editing ? EditOffIcon : EditIcon}
                  onClick={() => setEditing(!editing)}
                />
              </div>
            </Tooltip>
          </div>
        </div>

        <div
          className={`flex h-full w-full flex-col items-center justify-start overflow-y-auto p-2 pt-0 not-tiny:p-3 not-tiny:pt-0`}
        >
          {trackers.length !== 0 ? (
            <div>
              {trackers.filter((val) => val.variant === "value").length !==
                0 && (
                <h1 className="pb-1 pt-3 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
                  Number Trackers
                </h1>
              )}
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 not-tiny:w-full not-tiny:grid-cols-3">
                {trackers
                  .filter((val) => val.variant === "value")
                  .map((tracker) => (
                    <TrackerCard
                      editing={editing}
                      key={tracker.id}
                      tracker={tracker}
                      setTrackers={setTrackers}
                    />
                  ))}
              </div>
              {trackers.filter((val) => val.variant === "value-max").length !==
                0 && (
                <h1 className="pb-1 pt-3 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
                  Bar Trackers
                </h1>
              )}
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 not-tiny:w-full not-tiny:grid-cols-2">
                {trackers
                  .filter((val) => val.variant === "value-max")
                  .map((tracker) => (
                    <TrackerCard
                      editing={editing}
                      key={tracker.id}
                      tracker={tracker}
                      setTrackers={setTrackers}
                    />
                  ))}
              </div>
            </div>
          ) : sceneTrackers.length !== 0 ? (
            <button
              className="mt-3 rounded-lg border-none bg-paper/90 p-[6px] text-center text-text-primary no-underline shadow hover:bg-paper/55 dark:bg-paper-dark/70 dark:text-text-primary-dark dark:hover:bg-paper-dark/50"
              onClick={() => overwriteTrackers(sceneTrackers, setTrackers)}
            >
              Use scene trackers
            </button>
          ) : (
            <div className="mt-2 rounded-lg border-none p-[6px] text-center text-text-secondary no-underline dark:text-text-secondary-dark">
              Scene trackers not set
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TrackerCard = ({
  editing,
  tracker,
  setTrackers,
}: {
  editing: boolean;
  tracker: Tracker;
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>;
}): JSX.Element => {
  return (
    <div className="relative flex overflow-clip rounded bg-paper shadow dark:bg-paper-dark/90">
      {editing && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full  bg-purple-300/75 dark:bg-purple-700/75">
          <div className="flex h-full w-full items-center justify-evenly text-xl">
            <Tooltip placement="bottom" title={"Delete " + tracker.name}>
              <div className="flex justify-end">
                <IconButton
                  rounded="rounded"
                  Icon={DeleteIcon}
                  onClick={() => deleteTracker(tracker.id, setTrackers)}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col justify-between">
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
        />

        <div className="flex grow items-center justify-around py-2">
          {tracker.variant === "value" ? (
            <BubbleInput
              key={tracker.id}
              tracker={tracker}
              color={tracker.color}
              updateHandler={(content: string) =>
                updateTrackerField(tracker.id, "value", content, setTrackers)
              }
              hideLabel
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
              hideLabel
            ></BarInput>
          )}

          <SimplePopover
            buttonContent={
              <div className="grid grid-cols-2">
                <div className="col-span-2 flex justify-center">
                  <Palette className="size-4 fill-text-secondary dark:fill-text-secondary-dark" />
                </div>
                {tracker.showOnMap ? (
                  <OnMap className="size-4 fill-text-secondary dark:fill-text-secondary-dark" />
                ) : (
                  <NotOnMap className="size-4 fill-text-secondary dark:fill-text-secondary-dark" />
                )}
                {tracker.inlineMath ? (
                  <MathIcon className=" size-4 fill-text-secondary dark:fill-text-secondary-dark" />
                ) : (
                  <NoMathIcon className=" size-4 fill-text-secondary dark:fill-text-secondary-dark" />
                )}
              </div>
            }
            buttonClassname="rounded p-1 hover:bg-black/10 focus-visible:bg-black/10 hover:dark:bg-white/10 focus-visible:dark:bg-white/10"
            children={
              <div>
                <ColorPicker
                  color={tracker.color}
                  setColorNumber={(content) =>
                    updateTrackerField(
                      tracker.id,
                      "color",
                      content,
                      setTrackers,
                    )
                  }
                />
                <div className="flex">
                  <Tooltip
                    placement="bottom"
                    title={tracker.showOnMap ? "Hide From Map" : "Show on Map"}
                  >
                    <div className="flex justify-end">
                      <IconButton
                        padding=""
                        rounded=""
                        Icon={tracker.showOnMap ? OnMap : NotOnMap}
                        onClick={() => toggleShowOnMap(tracker.id, setTrackers)}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip
                    placement="bottom"
                    title={
                      tracker.inlineMath
                        ? "Disable Inline Math"
                        : "Enable Inline Math"
                    }
                  >
                    <div className="flex justify-end">
                      <IconButton
                        padding=""
                        rounded=""
                        Icon={tracker.inlineMath ? MathIcon : NoMathIcon}
                        onClick={() =>
                          toggleInlineMath(tracker.id, setTrackers)
                        }
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
