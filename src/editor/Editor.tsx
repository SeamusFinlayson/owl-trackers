import { useState } from "react";
import "../index.css";
import IconButton from "../components/IconButton.tsx";
import VisibleIcon from "../icons/VisibleIcon.tsx";
import NotVisibleIcon from "../icons/NotVisibleIcon.tsx";
import { Button, ThemeProvider, Tooltip } from "@mui/material";
import { Tracker } from "../TrackerZod.ts";
import EditOffIcon from "../icons/EditOffIcon.tsx";
import EditIcon from "../icons/EditIcon.tsx";
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
import { ModifyTrackers } from "../state/helpers/modifyTrackers.ts";
import { TrackersUpdate } from "../state/helpers/updateState.ts";
import { getTheme } from "../getTheme.ts";
import { cn } from "../lib/utils.ts";
import { Theme } from "@owlbear-rodeo/sdk";
import { Divider } from "../components/Divider.tsx";
import PartiallyControlledInput from "../components/PartiallyControlledInput.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function Editor({
  trackers,
  trackersHidden,
  title,
  editName = false,
  playerRole,
  updateTrackers,
  theme,
  actions,
}: {
  trackers: Tracker[];
  trackersHidden?: boolean;
  title: string;
  editName?: boolean;
  playerRole: "PLAYER" | "GM";
  updateTrackers: (update: TrackersUpdate) => void;
  theme: Theme;
  actions?: {
    title: string;
    buttons: { text: string; onClick: () => void; disabled?: boolean }[];
  }[];
}): React.JSX.Element {
  const [editing, setEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className={cn("h-screen", { dark: theme.mode === "DARK" })}>
      <ThemeProvider theme={getTheme(theme)}>
        <div className="bg-default dark:bg-default-dark flex h-full flex-col">
          <div className="bg-paper dark:bg-paper-dark/55 w-full p-1 pb-0.5 shadow">
            {editName ? (
              <PartiallyControlledInput
                className="text text-text-secondary dark:text-text-secondary-dark block w-full text-center text-xs font-semibold outline-none"
                parentValue={title}
                onUserConfirm={(element) =>
                  updateTrackers({ name: element.value })
                }
              />
            ) : (
              <div className="text text-text-secondary dark:text-text-secondary-dark text-center text-xs font-semibold">
                {title}
              </div>
            )}
            <div className="grid grid-cols-2 items-stretch gap-2 p-1">
              <div>
                {playerRole === "GM" && trackersHidden !== undefined && (
                  <Tooltip
                    title={trackersHidden ? "Show Trackers" : "Hide Trackers"}
                    placement="bottom-start"
                  >
                    <IconButton
                      className="size-full h-8 rounded-lg bg-black/5 dark:bg-white/5"

                      Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
                      onClick={() =>
                        updateTrackers({ hidden: !trackersHidden })
                      }
                    />
                  </Tooltip>
                )}
              </div>
              <Tooltip title={"Toggle Edit themeMode"} placement="bottom-end">
                <IconButton
                  className="size-full h-8 rounded-lg bg-black/5 dark:bg-white/5"
                  Icon={editing ? EditOffIcon : EditIcon}
                  onClick={() => setEditing(!editing)}
                />
              </Tooltip>
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
                            trackers: ModifyTrackers.delete(
                              trackers,
                              tracker.id,
                            ),
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
            ) : (
              actions &&
              actions
                .filter(
                  (val) =>
                    val.buttons.filter((val) => !val.disabled).length > 0,
                )
                .map((action) => (
                  <div key={action.title} className="w-full space-y-4 p-4">
                    <Divider title={action.title} titleAlignment="CENTER" />
                    <div className="flex justify-center gap-2">
                      {action.buttons
                        .filter((val) => !val.disabled)
                        .map((val) => (
                          <button
                            key={val.text}
                            className="bg-paper/90 text-text-primary hover:bg-paper/55 dark:bg-paper-dark/70 dark:text-text-primary-dark dark:hover:bg-paper-dark/50 w-16 rounded-lg border-none py-2 text-center no-underline shadow"
                            onClick={val.onClick}
                          >
                            {val.text}
                          </button>
                        ))}
                    </div>
                  </div>
                ))
            )}
            <div className="h-[163px] sm:h-[85.6px]" />
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 flex max-w-40 flex-row-reverse flex-wrap-reverse gap-2 p-2 sm:max-w-64">
          <Button
            className="pointer-events-auto"
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.checkbox(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
            size="small"
            startIcon={<AddIcon />}
            variant="contained"
          >
            Checkbox
          </Button>
          <Button
            className="pointer-events-auto"
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.bubble(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
            size="small"
            startIcon={<AddIcon />}
            variant="contained"
          >
            Number
          </Button>
          <Button
            className="pointer-events-auto"
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.counter(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
            size="small"
            startIcon={<AddIcon />}
            variant="contained"
          >
            Counter
          </Button>
          <Button
            className="pointer-events-auto"
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.bar(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
            size="small"
            startIcon={<AddIcon />}
            variant="contained"
          >
            Bar
          </Button>
        </div>
      </ThemeProvider>
    </div>
  );
}
