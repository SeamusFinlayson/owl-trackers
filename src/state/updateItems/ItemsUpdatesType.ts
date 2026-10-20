import { Tracker } from "../../trackerHelpersBasic";

export type ItemUpdate = {
  itemId: string;
  trackers?: Tracker[];
  hidden?: boolean;
};
