import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        background: resolve(
          import.meta.dirname,
          "src/background/background.html",
        ),
        context_embed: resolve(
          import.meta.dirname,
          "src/trackerMenu/trackerMenu.html",
        ),
        item_editor: resolve(import.meta.dirname, "src/editor/editor.html"),
        action: resolve(import.meta.dirname, "src/action/action.html"),
        scene_editor: resolve(
          import.meta.dirname,
          "src/sceneEditor/sceneEditor.html",
        ),
      },
    },
  },
  server: {
    cors: true,
    // origin: "https://www.owlbear.rodeo",
  },
});
