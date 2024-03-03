import { useOwlbearStoreSync } from "../useOwlbearStoreSync.ts";
import { Action } from "./Action.tsx";

export default function App(): JSX.Element {
  useOwlbearStoreSync();

  return <Action></Action>;
}
