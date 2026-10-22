import { Button, ThemeProvider } from "@mui/material";
import OBR, { Theme } from "@owlbear-rodeo/sdk";
import { getTheme } from "../getTheme";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { getPluginId } from "../getPluginId";

export function EditorFallback({
  theme,
  message = "Loading...",
}: {
  theme: Theme;
  message?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 500);
  }, []);

  return (
    <div className={cn("h-screen", { dark: theme.mode === "DARK" })}>
      <ThemeProvider theme={getTheme(theme)}>
        <div className="bg-default dark:bg-default-dark flex h-full flex-col">
          <div
            inert={!visible}
            data-visible={visible}
            className="flex h-full flex-col opacity-0 transition-opacity data-[visible=true]:opacity-100"
          >
            <div className="text-text-secondary dark:text-text-secondary-dark w-full p-4 pb-0.5 text-center text-sm font-semibold">
              {message}
            </div>
            <div className="grow" />
            <div className="flex w-full p-4">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => OBR.popover.close(getPluginId("editor"))}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
