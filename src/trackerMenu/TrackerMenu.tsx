import { useEffect, useState } from "react";
import { useOwlbearStore } from "../useOwlbearStore";
import "../index.css";
import BubbleInput from "../components/BubbleInput";
import IconButton from "../components/IconButton";
import AddIcon from "../icons/AddIcon";
import AddSquareIcon from "../icons/AddSquareIcon";
import VisibleIcon from "../icons/VisibleIcon";
import NotVisibleIcon from "../icons/NotVisibleIcon";
import BarInput from "../components/BarInput";

import OBR, { Item, Metadata } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import MoreIcon from "../icons/MoreIcon";
import { Tracker } from "../trackerHelpersBasic";
import { getTrackersFromSceneMetadata } from "../trackerHelpersScene";
import { useTrackersHidden } from "../useTrackersHidden";
import { useTrackerStore } from "../useTrackerStore";
import { getTrackersFromSelection } from "../trackerHelpersItem";

export default function TrackerMenu({
  initialSceneTrackers,
}: {
  initialSceneTrackers: Tracker[];
}): JSX.Element {
  const role = useOwlbearStore((state) => state.role);
  const mode = useOwlbearStore((state) => state.themeMode);

  const trackers = useTrackerStore((state) => state.trackers);
  const setTrackers = useTrackerStore((state) => state.setTrackers);
  const overWriteTrackers = useTrackerStore((state) => state.overWriteTrackers);
  const addTrackerBubble = useTrackerStore((state) => state.addTrackerBubble);
  const addTrackerBar = useTrackerStore((state) => state.addTrackerBar);
  const updateTrackerField = useTrackerStore(
    (state) => state.updateTrackerField,
  );

  const trackersHidden = useTrackersHidden();
  const [sceneTrackers, setSceneTrackers] =
    useState<Tracker[]>(initialSceneTrackers);

  const [initDone, setInitDone] = useState<{
    trackers: boolean;
    sceneTrackers: boolean;
  }>({ trackers: false, sceneTrackers: false });

  useEffect(() => {
    const updateTrackers = (items: Item[]) => {
      getTrackersFromSelection(items).then((newTracker) => {
        setTrackers(newTracker);
      });
    };
    OBR.scene.items
      .getItems()
      .then(updateTrackers)
      .then(() => setInitDone((prev) => ({ ...prev, trackers: true })));
    return OBR.scene.items.onChange(updateTrackers);
  }, []);

  useEffect(() => {
    const updateSceneTrackers = (metadata: Metadata) => {
      setSceneTrackers(getTrackersFromSceneMetadata(metadata));
    };
    OBR.scene
      .getMetadata()
      .then(updateSceneTrackers)
      .then(() => {
        setInitDone((prev) => ({ ...prev, sceneTrackers: true }));
      });
    return OBR.scene.onMetadataChange(updateSceneTrackers);
  }, []);

  const generateInput = (tracker: Tracker): JSX.Element => {
    if (tracker.variant === "value") {
      return (
        <BubbleInput
          key={tracker.id}
          tracker={tracker}
          color={tracker.color}
          updateHandler={(content: string) =>
            updateTrackerField(tracker.id, "value", content)
          }
          animateOnlyWhenRootActive={true}
        />
      );
    }
    return (
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
        animateOnlyWhenRootActive={true}
      ></BarInput>
    );
  };

  if (!initDone.trackers || !initDone.sceneTrackers) return <></>;

  return (
    // <button className="box"></button>
    <div
      className={`${mode === "DARK" ? "dark" : ""} h-screen overflow-y-auto`}
    >
      <div className={`flex flex-col gap-0.5 px-2 py-1`}>
        <div className="flex flex-row justify-center self-center rounded-full bg-white/25 dark:bg-black/25">
          {role === "GM" && (
            <IconButton
              Icon={trackersHidden.value ? NotVisibleIcon : VisibleIcon}
              onClick={() => trackersHidden.toggle()}
            ></IconButton>
          )}
          <IconButton
            Icon={AddIcon}
            onClick={() => addTrackerBubble()}
          ></IconButton>
          <IconButton
            Icon={AddSquareIcon}
            onClick={() => addTrackerBar()}
          ></IconButton>
          <IconButton
            Icon={MoreIcon}
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
        {trackers.length !== 0 ? (
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 rounded-xl bg-white/0">
            {trackers.map((tracker) => generateInput(tracker))}
          </div>
        ) : sceneTrackers.length !== 0 ? (
          <button
            className="self-center justify-self-center rounded-lg border-none bg-white/30 p-[6px] text-center text-text-primary no-underline hover:bg-white/20 dark:bg-black/15 dark:text-text-primary-dark dark:hover:bg-black/35"
            onClick={() => overWriteTrackers(sceneTrackers)}
          >
            Use scene trackers
          </button>
        ) : (
          <div className="self-center justify-self-center rounded-lg border-none p-[6px] text-center text-text-primary no-underline dark:text-text-primary-dark">
            Scene trackers not set
          </div>
        )}
      </div>
    </div>
  );
}
