import { useEffect, useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore";
import { useOwlbearStoreSync } from "../../useOwlbearStoreSync";
import "../index.css";
import BubbleInput from "../components/BubbleInput";
import IconButton from "../components/IconButton";
import AddIcon from "../icons/AddIcon";
import AddSquareIcon from "../icons/AddSquareIcon";
import VisibleIcon from "../icons/VisibleIcon";
import NotVisibleIcon from "../icons/NotVisibleIcon";
import BarInput from "../components/BarInput";
import {
  Tracker,
  TrackerVariant,
  getMetadataFromItems,
  writeTrackersHiddenToItem,
  writeTrackersToItem,
} from "../itemHelpers";
import OBR from "@owlbear-rodeo/sdk";
import NameInput from "../components/NameInput.tsx";
import DeleteIcon from "../icons/DeleteIcon.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import { getPluginId } from "../getPluginId.ts";
// import "./temp.css";

const randomColor = () => {
  return Math.floor(Math.random() * 6);
};

const createId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export default function App({
  initialMode,
  initialRole,
  initialTrackers,
  initialHidden,
}: {
  initialMode: "DARK" | "LIGHT";
  initialRole: "PLAYER" | "GM";
  initialTrackers: Tracker[];
  initialHidden: boolean;
}): JSX.Element {
  useOwlbearStoreSync();
  // Prevent flash on startup
  const setRole = useOwlbearStore((state) => state.setRole);
  const setMode = useOwlbearStore((state) => state.setMode);
  useEffect(() => {
    setMode(initialMode);
    setRole(initialRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const role = useOwlbearStore((state) => state.role); // TODO: prevent flash from hide icon being added in second render
  // console.log(role, initialRole);

  const mode = useOwlbearStore((state) => state.mode);
  // console.log(mode);

  const [trackersHidden, setTrackersHidden] = useState(initialHidden);
  const toggleHidden = () => {
    setTrackersHidden((prev) => {
      const value = !prev;
      writeTrackersHiddenToItem(value);
      return value;
    });
  };

  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);
  const updateTrackers = (
    updateFunction: (prevTrackers: Tracker[]) => void,
  ) => {
    setTrackers((prev) => {
      const draftTrackers = [...prev];
      updateFunction(draftTrackers);
      const sortedTrackers = draftTrackers
        .filter((value) => value.variant === "value")
        .sort((a, b) => a.position - b.position);
      sortedTrackers.push(
        ...draftTrackers
          .filter((value) => value.variant === "value-max")
          .sort((a, b) => a.position - b.position),
      );
      writeTrackersToItem(sortedTrackers);
      return sortedTrackers;
    });
  };

  useEffect(
    () =>
      OBR.scene.items.onChange((items) =>
        getMetadataFromItems(items).then(([newTracker, newTrackersHidden]) => {
          setTrackers(newTracker);
          setTrackersHidden(newTrackersHidden);
        }),
      ),
    [],
  );

  let occupiedSpaces = -1;
  const checkOccupiedSpaces = () => {
    if (occupiedSpaces !== -1) return occupiedSpaces;
    let spaces = 0;
    for (const tracker of trackers) {
      if (tracker.variant === "value") {
        spaces += 1;
      } else {
        spaces += 2;
      }
    }
    occupiedSpaces = spaces;
    return spaces;
  };

  const createPosition = (variant: TrackerVariant) => {
    return trackers.filter((tracker) => tracker.variant === variant).length;
  };

  const createBubble = (): Tracker => {
    return {
      id: createId(),
      name: "",
      variant: "value",
      position: createPosition("value"),
      color: randomColor(),
      value: 0,
    };
  };

  const createBar = (): Tracker => {
    return {
      id: createId(),
      name: "",
      variant: "value-max",
      position: createPosition("value-max"),
      color: randomColor(),
      value: 0,
      max: 0,
    };
  };

  const addTrackerBubble = () => {
    if (checkOccupiedSpaces() < 8) {
      updateTrackers((prev) => prev.push(createBubble()));
    }
  };
  const addTrackerBar = () => {
    if (checkOccupiedSpaces() < 7) {
      updateTrackers((prev) => prev.push(createBar()));
    }
  };

  const updateTrackerField = (
    id: string,
    field: "value" | "max" | "name" | "color",
    content: string | number,
  ) => {
    if ((field === "value" || field === "max") && typeof content === "string") {
      content = Math.trunc(parseFloat(content));
      if (isNaN(content)) content = 0;
    }
    updateTrackers((prevTrackers) => {
      const index = prevTrackers.findIndex((item) => item.id === id);
      prevTrackers.splice(index, 1, {
        ...prevTrackers[index],
        [field]: content,
      });
    });
  };

  const deleteTracker = (id: string) => {
    updateTrackers((prevTrackers) => {
      const index = prevTrackers.findIndex((item) => item.id === id);
      prevTrackers.splice(index, 1);
    });
  };

  const generateTrackerOptions = (tracker: Tracker): JSX.Element => {
    return (
      <div
        key={tracker.id}
        className={`not-tiny:basis-1 grid min-w-[170px] grow auto-cols-auto grid-cols-[1fr_36px] place-items-center gap-x-1 gap-y-2 rounded-lg bg-[#3d4051]/95 p-1 drop-shadow`}
      >
        <NameInput
          valueControl={tracker.name}
          inputProps={{
            onBlur: (e) =>
              updateTrackerField(tracker.id, "name", e.target.value),
          }}
        ></NameInput>

        <IconButton
          Icon={DeleteIcon}
          onClick={() => deleteTracker(tracker.id)}
          rounded="rounded-md"
          padding=""
        ></IconButton>

        <div className="col-span-2 flex w-full justify-stretch">
          <ColorPicker
            setColorNumber={(content) =>
              updateTrackerField(tracker.id, "color", content)
            }
          ></ColorPicker>
        </div>

        <div className="col-span-2 flex">
          {tracker.variant === "value" ? (
            <BubbleInput
              key={tracker.id}
              valueControl={tracker.value}
              color={tracker.color}
              inputProps={{
                // value: tracker.value,
                // onChange: (e) =>
                //   handleInputChange(tracker.id, "value", e.target.value),
                onBlur: (e) =>
                  updateTrackerField(tracker.id, "value", e.target.value),
              }}
            ></BubbleInput>
          ) : (
            <BarInput
              key={tracker.id}
              valueControl={tracker.value}
              maxControl={tracker.max}
              color={tracker.color}
              valueInputProps={{
                onBlur: (e) =>
                  updateTrackerField(tracker.id, "value", e.target.value),
              }}
              maxInputProps={{
                onBlur: (e) =>
                  updateTrackerField(tracker.id, "max", e.target.value),
              }}
            ></BarInput>
          )}
        </div>
      </div>
    );
  };

  return (
    // <button className="box"></button>
    <div className={mode === "DARK" ? "dark" : ""}>
      <div className={`flex flex-col gap-2 px-2 py-2`}>
        <div className="flex flex-row justify-center self-center rounded-full bg-[#1e2231]/80">
          <IconButton Icon={AddIcon} onClick={addTrackerBubble}></IconButton>
          <IconButton Icon={AddSquareIcon} onClick={addTrackerBar}></IconButton>

          {role === "GM" && (
            <IconButton
              Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
              onClick={toggleHidden}
            ></IconButton>
          )}
          <IconButton
            Icon={DeleteIcon}
            onClick={() => OBR.popover.close(getPluginId("editor"))}
          ></IconButton>
        </div>
        <div className="flex min-w-[220px] flex-row flex-wrap justify-around gap-x-2 gap-y-2 rounded-xl bg-[#1e2231]/80 p-2">
          {trackers.map((tracker) => generateTrackerOptions(tracker))}
        </div>
      </div>
    </div>
  );
}
