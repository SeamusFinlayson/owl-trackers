import { Button, Tooltip } from "@mui/material";
import { getBackgroundColor } from "../colorHelpers";
import ColorPicker from "../components/ColorPicker";
import NameInput from "../components/NameInput";
import PartiallyControlledInput from "../components/PartiallyControlledInput";
import { TrackerInput } from "../components/TrackerInput";
import CheckedCircle from "../icons/CheckedCircle";
import MathIcon from "../icons/MathIcon";
import NoMathIcon from "../icons/NoMathIcon";
import NotOnMap from "../icons/NotOnMap";
import OnMap from "../icons/OnMap";
import SimpleMinusIcon from "../icons/SimpleMinusIcon";
import SimplePlusIcon from "../icons/SimplePlusIcon";
import UncheckedCircle from "../icons/UncheckedCircle";
import { Tracker } from "../TrackerZod";
import IconButton from "../components/IconButton";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorIcon from "../icons/DragIndicatorIcon";
import { useState } from "react";

export default function TrackerCard({
  editing,
  tracker,
  updateTracker,
  deleteTracker,
  toggleShowOnMap,
  toggleInlineMath,
}: {
  editing: boolean;
  tracker: Tracker;
  updateTracker: (
    field: "value" | "max" | "name" | "color" | "checked",
    content: string | number | boolean,
  ) => void;
  deleteTracker: () => void;
  toggleShowOnMap: () => void;
  toggleInlineMath: () => void;
}): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tracker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [dragActive, setDragActive] = useState(false);
  const [dragHover, setDragHover] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-paper dark:bg-paper-dark relative flex cursor-default overflow-clip rounded-md drop-shadow-xs"
      tabIndex={-1}
    >
      <div
        className={`${getBackgroundColor(tracker.color)} flex w-full flex-col justify-between`}
      >
        {editing ? (
          <div className="flex h-full w-full justify-center">
            <Tooltip
              placement="bottom"
              title={"Drag to Reorder"}
              disableHoverListener
              open={dragHover && !dragActive}
            >
              <button
                {...listeners}
                className="flex h-full w-full cursor-grab touch-none flex-col items-center gap-0.5 active:cursor-grabbing active:bg-transparent dark:active:bg-transparent"
                onMouseDown={() => setDragActive(true)}
                onMouseUp={() => setDragActive(false)}
                onMouseEnter={() => setDragHover(true)}
                onMouseLeave={() => setDragHover(false)}
              >
                <DragIndicatorIcon
                  className={
                    "fill-text-secondary dark:fill-text-primary-dark rotate-90"
                  }
                />
                <div className="text-text-primary dark:text-text-primary-dark text-xs">
                  {tracker.name !== undefined && tracker.name.trim() !== ""
                    ? tracker.name
                    : convertVariantToLabel(tracker.variant)}
                </div>
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="pt-1 pl-2">
            <NameInput
              value={tracker.name !== undefined ? tracker.name : ""}
              onUserConfirm={(target) => updateTracker("name", target.value)}
            />
          </div>
        )}

        {editing ? (
          <div className="flex flex-col gap-y-2 p-2">
            <div className="flex justify-around">
              <ColorPicker
                colorNumber={tracker.color}
                setColorNumber={(color) => updateTracker("color", color)}
              />
              <Tooltip
                placement="bottom"
                title={
                  tracker.showOnMap !== false ? "Hide From Map" : "Show on Map"
                }
              >
                <IconButton
                  Icon={tracker.showOnMap !== false ? OnMap : NotOnMap}
                  onClick={() => toggleShowOnMap()}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                title={
                  tracker.inlineMath !== false
                    ? "Disable Inline Math"
                    : "Enable Inline Math"
                }
              >
                <IconButton
                  Icon={tracker.inlineMath !== false ? MathIcon : NoMathIcon}
                  onClick={() => toggleInlineMath()}
                />
              </Tooltip>
            </div>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color={"info"}
              onClick={() => deleteTracker()}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex items-end justify-between px-2 pt-1">
            {tracker.variant === "value" ? (
              <TrackerInput
                key={tracker.id}
                value={tracker.value.toString()}
                onConfirm={(content) => updateTracker("value", content)}
                previousHint
              />
            ) : tracker.variant === "value-max" ? (
              <div className="flex gap-2" key={tracker.id}>
                <TrackerInput
                  value={tracker.value.toString()}
                  onConfirm={(content) => updateTracker("value", content)}
                  previousHint
                />
                <div>/</div>
                <TrackerInput
                  value={tracker.max.toString()}
                  onConfirm={(content) => updateTracker("max", content)}
                  previousHint
                />
              </div>
            ) : tracker.variant === "checkbox" ? (
              <div key={tracker.id} className="pb-2">
                <IconButton
                  Icon={tracker.checked ? CheckedCircle : UncheckedCircle}
                  onClick={() => updateTracker("checked", !tracker.checked)}
                />
              </div>
            ) : (
              <div className="flex items-center pb-2">
                <div>
                  <IconButton
                    Icon={SimpleMinusIcon}
                    onClick={() =>
                      updateTracker(
                        "value",
                        `=${(tracker.value - 1).toString()}`,
                      )
                    }
                  />
                </div>
                <PartiallyControlledInput
                  parentValue={tracker.value.toString()}
                  onUserConfirm={(target) =>
                    updateTracker("value", target.value)
                  }
                  className="w-full shrink bg-transparent text-center outline-hidden"
                  clearContentOnFocus
                />

                <div>
                  <IconButton
                    Icon={SimplePlusIcon}
                    onClick={() =>
                      updateTracker(
                        "value",
                        `=${(tracker.value + 1).toString()}`,
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function convertVariantToLabel(variant: Tracker["variant"]) {
  switch (variant) {
    case "checkbox":
      return "Unnamed Checkbox";
    case "counter":
      return "Unnamed Counter";
    case "value":
      return "Unnamed Number";
    case "value-max":
      return "Unnamed Bar";
  }
}
