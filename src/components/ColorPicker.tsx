import React from "react";
import { getBackgroundColor, getColor } from "../colorHelpers";
import { Popover, Tooltip } from "@mui/material";
import IconButton from "./IconButton";
import Palette from "../icons/Palette";
import { cn } from "../lib/utils";
import { useTheme } from "@mui/material/styles";

export default function ColorPicker({
  colorNumber,
  setColorNumber,
}: {
  colorNumber: number;
  setColorNumber: (color: number) => void;
}): React.JSX.Element {
  const mode = useTheme().palette.mode;

  const colorButtons: React.JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    colorButtons.push(
      <button
        key={i}
        onClick={() => {
          setColorNumber(i);
        }}
        className="group grid size-[34px] place-items-center outline-hidden"
      >
        <div
          data-show={colorNumber === i}
          className="border-text-secondary dark:border-text-primary-dark z-50 grid size-4 scale-0 place-items-center rounded-full border-2 duration-50 data-[show=true]:scale-100"
        >
          <div className="bg-text-secondary dark:bg-text-primary-dark size-2 rounded-full" />
        </div>
        <div
          style={{ backgroundColor: getColor(i) }}
          className={cn(
            "absolute size-[24px] rounded-full duration-100 group-hover:scale-125 group-focus-visible:scale-150",
          )}
        />
      </button>,
    );
  }

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
    <div>
      <Tooltip title="Color Picker">
        <IconButton Icon={Palette} onClick={handleClick} />
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          className={cn(
            "grid size-[120px] grid-cols-3 place-items-center p-1",
            { dark: mode === "dark" },
          )}
        >
          {colorButtons}
        </div>
      </Popover>
    </div>
  );
}
