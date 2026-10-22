import { createTheme } from "@mui/material/styles";
import { Theme } from "@owlbear-rodeo/sdk";

/**
 * Create a MUI theme based off of the current OBR theme
 */

export function getTheme(theme?: Theme) {
  return createTheme({
    palette: theme
      ? {
          mode: theme.mode === "LIGHT" ? "light" : "dark",
          text: theme.text,
          info: {
            main: theme.mode === "LIGHT" ? "#000" : "#fff",
          },
          primary: theme.primary,
          secondary: theme.secondary,
          background: theme?.background,
        }
      : undefined,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiTooltip: {
        defaultProps: {
          disableInteractive: true,
        },
      },
    },
  });
}
