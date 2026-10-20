import { MenuItem, MenuList, Popover, Tooltip } from "@mui/material";
import React from "react";
import AddIcon from "../icons/AddIcon";
import IconButton from "./IconButton";
import { Tracker } from "../trackerHelpersBasic";
import { ModifyTrackers } from "../state/helpers/modifyTrackers";
import { useTheme } from "@mui/material/styles";
import { TrackersUpdate } from "../state/helpers/updateState";

export default function AddTrackerButton({
  dense,
  trackers,
  updateTrackers,
}: {
  dense?: boolean;
  trackers: Tracker[];
  updateTrackers: (update: TrackersUpdate) => void;
}): React.JSX.Element {
  const mode = useTheme().palette.mode;

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
        className={mode === "dark" ? "dark" : ""}
      >
        <MenuList dense={dense} disablePadding>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.checkbox(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Checkbox
          </MenuItem>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.bubble(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Number
          </MenuItem>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.counter(trackers);
              if (!changed) return;
              updateTrackers({ trackers: newTrackers });
            }}
          >
            Counter
          </MenuItem>
          <MenuItem
            onClick={() => {
              const { trackers: newTrackers, changed } =
                ModifyTrackers.create.bar(trackers);
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
