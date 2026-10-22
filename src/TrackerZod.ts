import z from "zod";

const TrackerBaseZod = z.object({
  id: z.string(),
  color: z.number(),
  name: z.string().optional(),
  showOnMap: z.boolean().optional(),
  inlineMath: z.boolean().optional(),
});
const ValueTrackerZod = z.object({
  variant: z.literal("value"),
  value: z.number(),
  ...TrackerBaseZod.shape,
});
const BarTrackerZod = z.object({
  variant: z.literal("value-max"),
  value: z.number(),
  max: z.number(),
  ...TrackerBaseZod.shape,
});
const CheckboxTrackerZod = z.object({
  variant: z.literal("checkbox"),
  checked: z.boolean(),
  ...TrackerBaseZod.shape,
});
const CounterTrackerZod = z.object({
  variant: z.literal("counter"),
  value: z.number(),
  ...TrackerBaseZod.shape,
});
export const TrackerZod = z.union([
  ValueTrackerZod,
  BarTrackerZod,
  CheckboxTrackerZod,
  CounterTrackerZod,
]);

export type Tracker = z.infer<typeof TrackerZod>;
