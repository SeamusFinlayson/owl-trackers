import { useState } from "react";
import "../index.css";
import IconButton from "../components/IconButton.tsx";
import VisibleIcon from "../icons/VisibleIcon.tsx";
import NotVisibleIcon from "../icons/NotVisibleIcon.tsx";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId.ts";
import { Tooltip } from "@mui/material";
import { Tracker } from "../trackerHelpersBasic.ts";
import EditOffIcon from "../icons/EditOffIcon.tsx";
import EditIcon from "../icons/EditIcon.tsx";
import { useTrackersHidden } from "../useTrackersHidden.ts";
import AddTrackerButton from "../components/AddTrackerButton.tsx";
import TrackerCard from "./TrackerCard.tsx";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";

export default function Editor({
  trackers,
  autofillTrackers,
  title,
  playerRole,
  updateTrackers,
}: {
  trackers: Tracker[];
  autofillTrackers: Tracker[];
  title: string;
  playerRole: "PLAYER" | "GM";
  updateTrackers: (trackers: Tracker[]) => void;
}): React.JSX.Element {
  const [editing, setEditing] = useState(false);

  const trackersHidden = useTrackersHidden();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (trackersHidden.value === true && playerRole === "PLAYER") {
    OBR.popover.close(getPluginId("editor"));
  }

  return (
    <>
      <div className="w-full  bg-paper p-1 pb-0.5 shadow dark:bg-paper-dark/55">
        <div className="text  text-center text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
          {title}
        </div>
        <div className="grid grid-cols-3">
          <div>
            {playerRole === "GM" && trackersHidden.value !== undefined && (
              <Tooltip
                title={trackersHidden.value ? "Show Trackers" : "Hide Trackers"}
                placement="bottom-start"
              >
                <IconButton
                  Icon={trackersHidden.value ? NotVisibleIcon : VisibleIcon}
                  onClick={() => trackersHidden.toggle()}
                />
              </Tooltip>
            )}
          </div>
          <div className="flex justify-self-center">
            <AddTrackerButton />
          </div>
          <div className="justify-self-end">
            <Tooltip title={"Toggle Edit themeMode"} placement="bottom-end">
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

      <div className="h-full overflow-y-auto overflow-x-clip">
        {trackers.length !== 0 ? (
          <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2 px-2 py-3 md:grid-cols-2 lg:grid-cols-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToFirstScrollableAncestor]}
              onDragEnd={(event) => {
                const { active, over } = event;

                if (over && active.id !== over.id) {
                  const oldIndex = trackers.findIndex(
                    (tracker) => tracker.id === active.id,
                  );
                  const newIndex = trackers.findIndex(
                    (tracker) => tracker.id === over.id,
                  );

                  updateTrackers(arrayMove(trackers, oldIndex, newIndex));
                }
              }}
            >
              <SortableContext
                items={trackers.map((tracker) => tracker.id)}
                strategy={rectSortingStrategy}
              >
                {trackers.map((tracker) => (
                  <TrackerCard
                    editing={editing}
                    key={tracker.id}
                    tracker={tracker}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : autofillTrackers.length !== 0 ? (
          <div className="flex justify-center">
            <button
              className="mt-3 rounded-lg border-none bg-paper/90 p-[6px] text-center text-text-primary no-underline shadow hover:bg-paper/55 dark:bg-paper-dark/70 dark:text-text-primary-dark dark:hover:bg-paper-dark/50"
              onClick={() => updateTrackers(autofillTrackers)}
            >
              Use scene trackers
            </button>
          </div>
        ) : (
          <div className="mt-2 rounded-lg border-none p-[6px] text-center text-text-secondary no-underline dark:text-text-secondary-dark">
            Scene trackers not set
          </div>
        )}
      </div>
    </>
  );
}
