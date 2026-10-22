import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";

export function openSceneTrackersPopover() {
  OBR.popover.open({
    id: getPluginId("scene-editor"),
    url: "/src/sceneEditor/sceneEditor.html",
    height: 550,
    width: 430,
    anchorOrigin: {
      horizontal: "CENTER",
      vertical: "CENTER",
    },
    transformOrigin: {
      horizontal: "CENTER",
      vertical: "CENTER",
    },
  });
}
