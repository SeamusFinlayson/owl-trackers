import { SegmentSettingsZod } from "./state/SettingsZod";

export function isSegmentSettings(value: unknown): value is [string, number][] {
  return SegmentSettingsZod.safeParse(value).success;
}
