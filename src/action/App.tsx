import OBR from "@owlbear-rodeo/sdk";
import ReportBugButton from "../components/ReportBugButton.tsx";
import { useOwlbearStore } from "../useOwlbearStore.ts";
import { useOwlbearStoreSync } from "../useOwlbearStoreSync.ts";
import { Action } from "./Action.tsx";
import ActionHeader from "./ActionHeader.tsx";
import { useSceneSettingsStoreSync } from "../useSceneSettingsStoreSync.ts";

export default function App(): JSX.Element {
  useOwlbearStoreSync();
  useSceneSettingsStoreSync();

  const sceneReady = useOwlbearStore((state) => state.sceneReady);
  const mode = useOwlbearStore((state) => state.mode);

  if (sceneReady) {
    return <Action></Action>;
  } else {
    OBR.action.setHeight(197);
    return (
      <div
        className={
          "h-screen " + "overflow-y-auto" + (mode === "DARK" ? " dark" : "")
        }
      >
        <div>
          {/* Header */}
          <ActionHeader></ActionHeader>

          <div className="flex w-full flex-col pt-3">
            <h2 className="justify-self-start px-4 py-2 text-sm text-text-secondary dark:text-text-secondary-dark">
              Open a scene to configure extension settings.
            </h2>

            {/* Report Bug button */}
            <ReportBugButton></ReportBugButton>
          </div>
        </div>
      </div>
    );
  }
}
