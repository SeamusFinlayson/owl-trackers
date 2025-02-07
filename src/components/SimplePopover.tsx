import { Popover } from "@mui/material";
import React from "react";
import { useOwlbearStore } from "../useOwlbearStore";

export default function SimplePopover({
  buttonContent,
  buttonClassname,
  children,
}: {
  buttonContent: JSX.Element;
  buttonClassname: string;
  children: JSX.Element;
}): JSX.Element {
  const mode = useOwlbearStore((state) => state.mode);

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
      <button className={buttonClassname} onClick={handleClick}>
        {buttonContent}
      </button>

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
        {children}
      </Popover>
    </div>
  );
}
