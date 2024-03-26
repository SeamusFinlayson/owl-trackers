import { useOwlbearStoreSync } from "../useOwlbearStoreSync.ts";
import { Action } from "./Action.tsx";

export default function App({
  initialVerticalOffset,
  initialTrackersAboveToken,
  initialBarHeightIsReduced,
}: {
  initialVerticalOffset: number;
  initialTrackersAboveToken: boolean;
  initialBarHeightIsReduced: boolean;
}): JSX.Element {
  useOwlbearStoreSync();

  return (
    <Action
      initialVerticalOffset={initialVerticalOffset}
      initialTrackersAboveToken={initialTrackersAboveToken}
      initialBarHeightIsReduced={initialBarHeightIsReduced}
    ></Action>
  );
}
