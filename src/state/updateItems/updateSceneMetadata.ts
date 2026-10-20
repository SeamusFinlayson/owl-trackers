import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import {
  HIDDEN_METADATA_ID,
  TRACKER_METADATA_ID,
} from "../../trackerHelpersBasic";
import { getPluginId } from "../../getPluginId";
import { MetadataUpdate } from "./UpdatesType";

export function updateSceneMetadata(update: MetadataUpdate) {
  const metadata: Metadata = {};

  if ("trackers" in update)
    metadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
  if ("hidden" in update)
    metadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;

  OBR.scene.setMetadata(metadata);
}
