import { MenuItem, MenuList, Popover, Tooltip } from "@mui/material";
import React from "react";
import { useOwlbearStore } from "../useOwlbearStore";
import AddIcon from "../icons/AddIcon";
import IconButton from "./IconButton";
import { ItemUpdate } from "../state/updateItems/ItemsUpdatesType";
import { Tracker } from "../trackerHelpersBasic";
import { createTracker } from "../state/trackerManipulation/createTracker";

export default function AddTrackerButton({
  dense,
  trackers,
  updateTrackers,
}: {
  dense?: boolean;
  trackers: Tracker[];
  updateTrackers: (update: Omit<ItemUpdate, "itemId">) => void;
}): React.JSX.Element {
  const mode = useOwlbearStore((state) => state.themeMode);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="flex items-end justify-end">
      {dense === true ? (
        <IconButton Icon={AddIcon} onClick={handleClick} />
      ) : (
        <Tooltip title="Add Tracker">
          <IconButton Icon={AddIcon} onClick={handleClick} />
        </Tooltip>
      )}

      <button></button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className={mode === "DARK" ? "dark" : ""}
      >
        <MenuList dense={dense} disablePadding>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                createTracker.checkbox(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Checkbox
          </MenuItem>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                createTracker.checkbox(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Number
          </MenuItem>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                createTracker.checkbox(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Counter
          </MenuItem>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                createTracker.checkbox(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Bar
          </MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
}
