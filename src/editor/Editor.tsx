import { useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore.ts";
import "../index.css";
import BubbleInput from "../components/BubbleInput.tsx";
import IconButton from "../components/IconButton.tsx";
import AddIcon from "../icons/AddIcon.tsx";
import AddSquareIcon from "../icons/AddSquareIcon.tsx";
import VisibleIcon from "../icons/VisibleIcon.tsx";
import NotVisibleIcon from "../icons/NotVisibleIcon.tsx";
import BarInput from "../components/BarInput.tsx";

import OBR from "@owlbear-rodeo/sdk";
import NameInput from "../components/NameInput.tsx";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import { getPluginId } from "../getPluginId.ts";
import OnMap from "../icons/OnMap.tsx";
import NotOnMap from "../icons/NotOnMap.tsx";
import MathIcon from "../icons/MathIcon.tsx";
import NoMathIcon from "../icons/NoMathIcon.tsx";
import { Divider, Tooltip } from "@mui/material";
import { Tracker } from "../trackerHelpersBasic.ts";
import EditOffIcon from "../icons/EditOffIcon.tsx";
import EditIcon from "../icons/EditIcon.tsx";
import Palette from "../icons/Palette.tsx";
import SimplePopover from "../components/SimplePopover.tsx";
import { useTrackerStore } from "../useTrackerStore.ts";
import { useTrackersHidden } from "../useTrackersHidden.ts";
import { getBackgroundColor } from "../colorHelpers.tsx";

export default function Editor({
  trackers,
  autofillTrackers,
  title,
}: {
  trackers: Tracker[];
  autofillTrackers: Tracker[];
  title: string;
}): JSX.Element {
  const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.themeMode);

  const overWriteTrackers = useTrackerStore((state) => state.overWriteTrackers);
  const addTrackerBubble = useTrackerStore((state) => state.addTrackerBubble);
  const addTrackerBar = useTrackerStore((state) => state.addTrackerBar);

  const [editing, setEditing] = useState(false);

  const trackersHidden = useTrackersHidden();

  if (trackersHidden.value && role === "PLAYER") {
    OBR.popover.close(getPluginId("editor"));
  }

  return (
    <div className={`${mode === "DARK" ? "dark" : ""} over h-screen`}>
      <div className="flex h-full flex-col bg-default dark:bg-default-dark">
        <div className="w-full  bg-paper p-1 pb-0.5 shadow dark:bg-paper-dark/55">
          <div className="text  text-center text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
            {title}
          </div>
          <div className="grid grid-cols-3">
            <div>
              {role === "GM" && trackersHidden.value !== undefined && (
                <Tooltip
                  title={
                    trackersHidden.value ? "Show Trackers" : "Hide Trackers"
                  }
                >
                  <div className="w-fit rounded-full">
                    <IconButton
                      Icon={trackersHidden.value ? NotVisibleIcon : VisibleIcon}
                      onClick={() => trackersHidden.toggle()}
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
                    onClick={() => addTrackerBubble()}
                  />
                </div>
              </Tooltip>
              <Tooltip title={"Add Bar Tracker"}>
                <div className="rounded-full">
                  <IconButton
                    Icon={AddSquareIcon}
                    onClick={() => addTrackerBar()}
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
                    />
                  ))}
              </div>
            </div>
          ) : autofillTrackers.length !== 0 ? (
            <button
              className="mt-3 rounded-lg border-none bg-paper/90 p-[6px] text-center text-text-primary no-underline shadow hover:bg-paper/55 dark:bg-paper-dark/70 dark:text-text-primary-dark dark:hover:bg-paper-dark/50"
              onClick={() => overWriteTrackers(autofillTrackers)}
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
}: {
  editing: boolean;
  tracker: Tracker;
}): JSX.Element => {
  const deleteTracker = useTrackerStore((state) => state.deleteTracker);
  const updateTrackerField = useTrackerStore(
    (state) => state.updateTrackerField,
  );
  const toggleShowOnMap = useTrackerStore((state) => state.toggleShowOnMap);
  const toggleInlineMath = useTrackerStore((state) => state.toggleInlineMath);

  return (
    <div className="relative flex overflow-clip rounded bg-paper drop-shadow-sm dark:bg-paper-dark/90">
      {editing && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full  bg-purple-300/75 dark:bg-purple-700/75">
          <div className="flex h-full w-full items-center justify-evenly text-xl">
            <Tooltip placement="bottom" title={"Delete " + tracker.name}>
              <div className="flex justify-end">
                <IconButton
                  rounded="rounded"
                  Icon={DeleteIcon}
                  onClick={() => deleteTracker(tracker.id)}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      )}
      <div
        className={`${getBackgroundColor(tracker.color)} flex w-full flex-col justify-between`}
      >
        <NameInput
          valueControl={tracker.name}
          inputProps={{
            onBlur: (e) =>
              updateTrackerField(tracker.id, "name", e.target.value),
          }}
        />

        <div className="flex grow items-end justify-between p-1 pt-0">
          {tracker.variant === "value" ? (
            <BubbleInput
              key={tracker.id}
              tracker={tracker}
              color={tracker.color}
              updateHandler={(content: string) =>
                updateTrackerField(tracker.id, "value", content)
              }
              noBackground
            />
          ) : (
            <BarInput
              key={tracker.id}
              tracker={tracker}
              color={tracker.color}
              valueUpdateHandler={(content: string) =>
                updateTrackerField(tracker.id, "value", content)
              }
              maxUpdateHandler={(content: string) =>
                updateTrackerField(tracker.id, "max", content)
              }
              noBackground
            />
          )}

          <SimplePopover
            buttonContent={
              <div className="flex size-8 flex-col items-center justify-center gap-[0.5px]">
                <div className="flex  justify-center">
                  <Palette className="size-[18px] min-h-[18px] min-w-[18px] fill-text-secondary dark:fill-text-primary-dark" />
                </div>
                <div className="flex w-full justify-center gap-[1px]">
                  {tracker.showOnMap ? (
                    <OnMap className="size-[18px] min-h-[18px] min-w-[18px]  fill-text-secondary dark:fill-text-primary-dark" />
                  ) : (
                    <NotOnMap className="size-[18px] min-h-[18px] min-w-[18px]  fill-text-secondary dark:fill-text-primary-dark" />
                  )}
                  {tracker.inlineMath ? (
                    <MathIcon className=" size-[18px] min-h-[18px] min-w-[18px]  fill-text-secondary dark:fill-text-primary-dark" />
                  ) : (
                    <NoMathIcon className=" size-[18px] min-h-[18px] min-w-[18px]  fill-text-secondary dark:fill-text-primary-dark" />
                  )}
                </div>
              </div>
            }
            buttonClassname="rounded size-[44px] flex justify-center items-center p-1 hover:bg-black/10 focus-visible:bg-black/10 hover:dark:bg-white/10 focus-visible:dark:bg-white/10"
            children={
              <div>
                <ColorPicker
                  color={tracker.color}
                  setColorNumber={(content) =>
                    updateTrackerField(tracker.id, "color", content)
                  }
                />

                <Divider variant="middle" />

                <div className="flex justify-center p-1">
                  <Tooltip
                    placement="bottom"
                    title={tracker.showOnMap ? "Hide From Map" : "Show on Map"}
                  >
                    <div className="flex justify-end">
                      <IconButton
                        padding=""
                        Icon={tracker.showOnMap ? OnMap : NotOnMap}
                        onClick={() => toggleShowOnMap(tracker.id)}
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
                        Icon={tracker.inlineMath ? MathIcon : NoMathIcon}
                        onClick={() => toggleInlineMath(tracker.id)}
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
