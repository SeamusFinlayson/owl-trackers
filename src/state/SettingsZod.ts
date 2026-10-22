import z from "zod";

export const SegmentSettingsZod = z.array(z.tuple([z.string(), z.number()]));

export const SettingsZod = z.object({
  verticalOffset: z.number(),
  trackersAboveToken: z.boolean(),
  barHeightIsReduced: z.boolean(),
  segmentsEnabled: z.boolean(),
  segmentSettings: SegmentSettingsZod,
});

export type SegmentSettings = z.infer<typeof SegmentSettingsZod>;
export type Settings = z.infer<typeof SettingsZod>;
