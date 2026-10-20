import { Tracker } from "../../trackerHelpersBasic";

export type MetadataUpdate = {
  trackers?: Tracker[];
  hidden?: boolean;
};

export type ItemMetadataUpdate = {
  itemId: string;
} & MetadataUpdate;
