import { useState } from "react";
import "../index.css";
import IconButton from "../components/IconButton.tsx";
import VisibleIcon from "../icons/VisibleIcon.tsx";
import NotVisibleIcon from "../icons/NotVisibleIcon.tsx";
import { Tooltip } from "@mui/material";
import { Tracker } from "../trackerHelpersBasic.ts";
import EditOffIcon from "../icons/EditOffIcon.tsx";
import EditIcon from "../icons/EditIcon.tsx";
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
import { MetadataUpdate } from "../state/updateItems/UpdatesType.ts";
import { ModifyTrackers } from "../state/trackerManipulation/modifyTrackers.ts";

export default function Editor({
  trackers,
  trackersHidden,
  autofillTrackers,
  title,
  playerRole,
  updateTrackers,
}: {
  trackers: Tracker[];
  trackersHidden?: boolean;
  autofillTrackers: Tracker[];
  title: string;
  playerRole: "PLAYER" | "GM";
  updateTrackers: (update: MetadataUpdate) => void;
}): React.JSX.Element {
  const [editing, setEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <div className="bg-paper dark:bg-paper-dark/55 w-full p-1 pb-0.5 shadow">
        <div className="text text-text-secondary dark:text-text-secondary-dark text-center text-xs font-semibold">
          {title}
        </div>
        <div className="grid grid-cols-3">
          <div>
            {playerRole === "GM" && trackersHidden !== undefined && (
              <Tooltip
                title={trackersHidden ? "Show Trackers" : "Hide Trackers"}
                placement="bottom-start"
              >
                <IconButton
                  Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
                  onClick={() => updateTrackers({ hidden: !trackersHidden })}
                />
              </Tooltip>
            )}
          </div>
          <div className="flex justify-self-center">
            <AddTrackerButton
              trackers={trackers}
              updateTrackers={updateTrackers}
            />
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

      <div className="h-full overflow-x-clip overflow-y-auto">
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

                  updateTrackers({
                    trackers: arrayMove(trackers, oldIndex, newIndex),
                  });
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
                    deleteTracker={() =>
                      updateTrackers({
                        trackers: ModifyTrackers.delete(trackers, tracker.id),
                      })
                    }
                    toggleInlineMath={() =>
                      updateTrackers({
                        trackers: ModifyTrackers.toggle.inlineMath(
                          trackers,
                          tracker.id,
                        ),
                      })
                    }
                    toggleShowOnMap={() =>
                      updateTrackers({
                        trackers: ModifyTrackers.toggle.showOnMap(
                          trackers,
                          tracker.id,
                        ),
                      })
                    }
                    updateTracker={(
                      field: "value" | "max" | "name" | "color" | "checked",
                      content: string | number | boolean,
                    ) =>
                      updateTrackers({
                        trackers: ModifyTrackers.update.field(
                          trackers,
                          tracker.id,
                          field,
                          content,
                        ),
                      })
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : autofillTrackers.length !== 0 ? (
          <div className="flex justify-center">
            <button
              className="bg-paper/90 text-text-primary hover:bg-paper/55 dark:bg-paper-dark/70 dark:text-text-primary-dark dark:hover:bg-paper-dark/50 mt-3 rounded-lg border-none p-[6px] text-center no-underline shadow"
              onClick={() => updateTrackers({ trackers: autofillTrackers })}
            >
              Use scene trackers
            </button>
          </div>
        ) : (
          <div className="text-text-secondary dark:text-text-secondary-dark mt-2 rounded-lg border-none p-[6px] text-center no-underline">
            Scene trackers not set
          </div>
        )}
      </div>
    </>
  );
}
