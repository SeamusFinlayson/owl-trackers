import z from "zod";

const TrackerBaseZod = z.object({
  id: z.string(),
  color: z.number(),
  name: z.string().optional(),
  showOnMap: z.boolean().optional(),
  inlineMath: z.boolean().optional(),
});
const ValueTracker = z.object({
  variant: z.literal("value"),
  value: z.number(),
  ...TrackerBaseZod.shape,
});
const BarTracker = z.object({
  variant: z.literal("value-max"),
  value: z.number(),
  max: z.number(),
  ...TrackerBaseZod.shape,
});
const CheckboxTracker = z.object({
  variant: z.literal("checkbox"),
  checked: z.boolean(),
  ...TrackerBaseZod.shape,
});
const CounterTracker = z.object({
  variant: z.literal("counter"),
  value: z.number(),
  ...TrackerBaseZod.shape,
});
export const Tracker = z.union([
  ValueTracker,
  BarTracker,
  CheckboxTracker,
  CounterTracker,
]);

export type Tracker = z.infer<typeof Tracker>;
