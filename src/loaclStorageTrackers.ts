import OBR from "@owlbear-rodeo/sdk";
import { Tracker, TrackerZod } from "./TrackerZod";

const getStorageKey = (roomId: string) => `${roomId}-local-trackers`;

export function getLocalTrackers(): Tracker[] | null {
  const data = localStorage.getItem(getStorageKey(OBR.room.id));
  if (!data) return null;
  try {
    const json = JSON.parse(data);
    const trackers = TrackerZod.array().safeParse(json);
    if (trackers.error) return null;
    return trackers.data;
  } catch (e) {
    return null;
  }
}

export function setLocalTrackers(trackers: Tracker[]) {
  TrackerZod.array().parse(trackers);
  localStorage.setItem(getStorageKey(OBR.room.id), JSON.stringify(trackers));
}
