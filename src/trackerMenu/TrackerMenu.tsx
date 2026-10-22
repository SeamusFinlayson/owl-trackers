import "../index.css";
import NumberTrackerInput from "../components/NumberTrackerInput";
import IconButton from "../components/IconButton";
import VisibleIcon from "../icons/VisibleIcon";
import NotVisibleIcon from "../icons/NotVisibleIcon";

import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import { Tracker } from "../TrackerZod";
import BarTrackerInput from "../components/BarTrackerInput";
import CheckboxTrackerInput from "../components/CheckboxTrackerInput";
import OpenInNewIcon from "../icons/OpenInNewIcon";
import AddTrackerButton from "../components/AddTrackerButton";
import CounterTrackerInput from "../components/CounterTrackerInput";
import { TrackersState } from "../state/TrackersStateType";
import { ModifyTrackers } from "../state/helpers/modifyTrackers";
import { TrackersUpdate } from "../state/helpers/updateState";

export default function TrackerMenu({
  playerRole,
  selectionTrackers,
  selectionTrackersHidden,
  sceneTrackers,
  updateTrackers,
}: {
  playerRole: NonNullable<TrackersState["playerRole"]>;
  selectionTrackers: NonNullable<TrackersState["selectionTrackers"]>;
  selectionTrackersHidden: NonNullable<
    TrackersState["selectionTrackersHidden"]
  >;
  sceneTrackers: NonNullable<TrackersState["sceneTrackers"]>;
  updateTrackers: (update: TrackersUpdate) => void;
}): React.JSX.Element {
  const generateInput = (tracker: Tracker): React.JSX.Element => {
    if (tracker.variant === "value") {
      return (
        <NumberTrackerInput
          key={tracker.id}
          tracker={tracker}
          color={tracker.color}
          updateHandler={(content: string) => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "value",
              content,
            );
            updateTrackers({ trackers });
          }}
          animateOnlyWhenRootActive={true}
        />
      );
    } else if (tracker.variant === "value-max") {
      return (
        <BarTrackerInput
          key={tracker.id}
          tracker={tracker}
          color={tracker.color}
          valueUpdateHandler={(content: string) => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "value",
              content,
            );
            updateTrackers({ trackers });
          }}
          maxUpdateHandler={(content: string) => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "max",
              content,
            );
            updateTrackers({ trackers });
          }}
          animateOnlyWhenRootActive={true}
        />
      );
    } else if (tracker.variant === "counter") {
      return (
        <CounterTrackerInput
          key={tracker.id}
          tracker={tracker}
          color={tracker.color}
          updateHandler={(content: string) => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "value",
              content,
            );
            updateTrackers({ trackers });
          }}
          increment={() => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "value",
              `=${(tracker.value + 1).toString()}`,
            );
            updateTrackers({ trackers });
          }}
          decrement={() => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "value",
              `=${(tracker.value - 1).toString()}`,
            );
            updateTrackers({ trackers });
          }}
          animateOnlyWhenRootActive={true}
        />
      );
    } else
      return (
        <CheckboxTrackerInput
          key={tracker.id}
          tracker={tracker}
          color={tracker.color}
          updateHandler={(checked) => {
            const trackers = ModifyTrackers.update.field(
              selectionTrackers,
              tracker.id,
              "checked",
              checked,
            );
            updateTrackers({ trackers });
          }}
          animateOnlyWhenRootActive={true}
        />
      );
  };

  return (
    <div className={`flex flex-col gap-2 px-2 py-1`}>
      <div className="flex flex-row justify-center gap-1 self-center rounded-full bg-white/25 p-0.5 dark:bg-black/25">
        {playerRole === "GM" && (
          <IconButton
            Icon={
              selectionTrackersHidden === true ? NotVisibleIcon : VisibleIcon
            }
            onClick={() => updateTrackers({ hidden: !selectionTrackersHidden })}
          ></IconButton>
        )}
        <AddTrackerButton
          dense
          trackers={selectionTrackers}
          updateTrackers={updateTrackers}
        />
        <IconButton
          Icon={OpenInNewIcon}
          onClick={() => {
            OBR.popover.open({
              id: getPluginId("editor"),
              url: "/src/editor/editor.html",
              height: 550,
              width: 430,
              anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
              transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
            });
          }}
        ></IconButton>
      </div>
      {selectionTrackers.length !== 0 ? (
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 rounded-xl bg-white/0">
          {selectionTrackers.map((tracker) => generateInput(tracker))}
        </div>
      ) : sceneTrackers.length !== 0 ? (
        <button
          className="text-text-primary dark:text-text-primary-dark self-center justify-self-center rounded-lg border-none bg-white/30 p-[6px] text-center no-underline hover:bg-white/20 dark:bg-black/15 dark:hover:bg-black/35"
          onClick={() => {
            updateTrackers({ trackers: sceneTrackers });
          }}
        >
          Use scene trackers
        </button>
      ) : (
        <div className="text-text-primary dark:text-text-primary-dark self-center justify-self-center rounded-lg border-none p-[6px] text-center no-underline">
          Scene trackers not set
        </div>
      )}
    </div>
  );
}
