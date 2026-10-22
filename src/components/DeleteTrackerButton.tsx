import { Button, Popover } from "@mui/material";
import React from "react";
import { Tracker } from "../TrackerZod";
import { ModifyTrackers } from "../state/helpers/modifyTrackers";
import { useTheme } from "@mui/material/styles";
import { TrackersUpdate } from "../state/helpers/updateState";

export default function DeleteTrackerButton({
  trackerId,
  trackers,
  updateTrackers,
  children,
}: {
  trackerId: string;
  trackers: Tracker[];
  updateTrackers: (update: TrackersUpdate) => void;
  children: any;
}): React.JSX.Element {
  const mode = useTheme().palette.mode;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="flex items-end justify-end">
      <div onContextMenu={handleClick}>{children}</div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        className={mode === "dark" ? "dark" : ""}
      >
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            updateTrackers({
              trackers: ModifyTrackers.delete(trackers, trackerId),
            });
          }}
        >
          Delete
        </Button>
      </Popover>
    </div>
  );
}
