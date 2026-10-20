import { Metadata } from "@owlbear-rodeo/sdk";
import {
  HIDDEN_METADATA_ID,
  TRACKER_METADATA_ID,
} from "../../trackerHelpersBasic";
import { getPluginId } from "../../getPluginId";
import { MetadataUpdate } from "./UpdatesType";

export function updateStateSceneMetadata(
  update: MetadataUpdate,
  metadata: Metadata,
  updateMetadata: (metadata: Metadata) => void,
) {
  const newMetadata: Metadata = { ...metadata };

  if ("trackers" in update)
    newMetadata[getPluginId(TRACKER_METADATA_ID)] = update.trackers;
  if ("hidden" in update)
    newMetadata[getPluginId(HIDDEN_METADATA_ID)] = update.hidden;

  updateMetadata(newMetadata);
}
