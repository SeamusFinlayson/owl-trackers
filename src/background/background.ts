import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import menuIcon from "../assets/owl-trackers-logo-outline.svg";
import { initOnMapTrackers } from "./onMapTrackers";
import { HIDDEN_METADATA_ID } from "../basicTrackerHelpers";

/**
 * This file represents the background script run when the plugin loads.
 * It creates the context menu items.
 */

OBR.onReady(async () => {
  fetch("/manifest.json")
    .then((response) => response.json())
    .then((json) =>
      console.log(json["name"] + " - version: " + json["version"]),
    );

  // create player context menu icon
  OBR.contextMenu.create({
    id: getPluginId("player-menu"),
    icons: [
      {
        icon: menuIcon,
        label: "Edit Stats",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
            {
              key: ["metadata", `com.owl-trackers/${HIDDEN_METADATA_ID}`],
              value: true,
              operator: "!=",
            },
          ],
          permissions: ["UPDATE"],
          roles: ["PLAYER"],
          max: 1,
        },
      },
    ],
    embed: {
      url: "/src/trackerMenu/trackerMenu.html",
      height: 152,
    },
  });

  // create GM context menu icon
  OBR.contextMenu.create({
    id: getPluginId("gm-menu"),
    icons: [
      {
        icon: menuIcon,
        label: "Owl Trackers",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER", coordinator: "||" },
            { key: "layer", value: "MOUNT" },
            { key: "type", value: "IMAGE" },
          ],
          roles: ["GM"],
          max: 1,
        },
      },
    ],
    embed: {
      url: "/src/trackerMenu/trackerMenu.html",
      height: 152,
    },
  });

  initOnMapTrackers();
});
