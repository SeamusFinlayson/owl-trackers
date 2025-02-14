import { useOwlbearStore } from "../useOwlbearStore";
import IconButton from "../components/IconButton";
import MoreIcon from "../icons/MoreIcon";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import ToggleButton from "../components/ToggleButton";
import { useEffect } from "react";
import Input from "../components/Input";
import {
  BAR_HEIGHT_METADATA_ID,
  TRACKERS_ABOVE_METADATA_ID,
  VERTICAL_OFFSET_METADATA_ID,
} from "../sceneMetadataHelpers";
import ActionHeader from "./ActionHeader";
import ReportBugButton from "../components/ReportBugButton";
import { useSceneSettingsStore } from "../useSceneSettingsStore";

export function Action(): React.JSX.Element {
  const mode = useOwlbearStore((state) => state.themeMode);
  const role = useOwlbearStore((state) => state.role);

  useEffect(() => {
    if (role === "GM") OBR.action.setHeight(313);
    else OBR.action.setHeight(197);
  }, [role]);

  const verticalOffset = useSceneSettingsStore((state) => state.verticalOffset);
  const trackersAboveToken = useSceneSettingsStore(
    (state) => state.trackersAboveToken,
  );
  const barHeightIsReduced = useSceneSettingsStore(
    (state) => state.barHeightIsReduced,
  );

  const setVerticalOffset = useSceneSettingsStore(
    (state) => state.setVerticalOffset,
  );
  const setTrackersAboveToken = useSceneSettingsStore(
    (state) => state.setTrackersAboveToken,
  );
  const setBarHeightIsReduced = useSceneSettingsStore(
    (state) => state.setBarHeightIsReduced,
  );

  // const [segmentsEnabled, setSegmentsEnabled] = useState(false);

  // const [hideScrollbar, setHideScrollbar] = useState(false);

  // const baseHeight = 373;

  // OBR.action.getHeight().then((value) => console.log(value));
  // console.log(window.innerHeight);

  // sync action height with segments dropdown
  // useEffect(() => {
  //   let newHeight: number;
  //   if (segmentsEnabled) {
  //     newHeight = baseHeight + 156;
  //   } else {
  //     newHeight = baseHeight;
  //   }
  //   if (newHeight < window.innerHeight) {
  //     // console.log(true);
  //     // setHideScrollbar(true);
  //     // setTimeout(() => setHideScrollbar(false), 300);
  //   }
  //   OBR.action.setHeight(newHeight);
  // }, [segmentsEnabled]);

  return (
    <div
      className={
        "h-screen " + "overflow-y-auto" + (mode === "DARK" ? " dark" : "")
      }
    >
      <div>
        {/* Header */}
        <ActionHeader></ActionHeader>

        {/* Settings */}
        <div className="flex w-full flex-col pt-3">
          {role === "PLAYER" ? (
            <h2 className="justify-self-start px-4 py-2 text-sm text-text-secondary dark:text-text-secondary-dark">
              Must have GM access to configure settings.
            </h2>
          ) : (
            <>
              <div className="grid w-full auto-rows-fr grid-cols-[auto_50px] items-center justify-items-center gap-x-1 gap-y-1 px-4">
                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Set scene default trackers
                </h2>
                <IconButton
                  Icon={MoreIcon}
                  onClick={() =>
                    OBR.popover.open({
                      id: getPluginId("scene-editor"),
                      url: "/src/sceneEditor/sceneEditor.html",
                      height: 550,
                      width: 430,
                      anchorOrigin: {
                        horizontal: "CENTER",
                        vertical: "CENTER",
                      },
                      transformOrigin: {
                        horizontal: "CENTER",
                        vertical: "CENTER",
                      },
                    })
                  }
                ></IconButton>

                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Vertical Offset
                </h2>
                <Input
                  value={verticalOffset}
                  updateHandler={(value: number) => {
                    setVerticalOffset(value);
                    OBR.scene.setMetadata({
                      [getPluginId(VERTICAL_OFFSET_METADATA_ID)]: value,
                    });
                  }}
                ></Input>

                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Trackers above token
                </h2>
                <ToggleButton
                  isChecked={trackersAboveToken}
                  changeHandler={(isChecked: boolean) => {
                    setTrackersAboveToken(isChecked);
                    OBR.scene.setMetadata({
                      [getPluginId(TRACKERS_ABOVE_METADATA_ID)]: isChecked,
                    });
                  }}
                ></ToggleButton>

                {/* Default trackers */}
                <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Use reduced bar height
                </h2>
                <ToggleButton
                  isChecked={barHeightIsReduced}
                  changeHandler={(isChecked: boolean) => {
                    setBarHeightIsReduced(isChecked);
                    OBR.scene.setMetadata({
                      [getPluginId(BAR_HEIGHT_METADATA_ID)]: isChecked,
                    });
                  }}
                ></ToggleButton>

                {/* Segments */}
                {/* <h2 className="justify-self-start text-sm text-text-primary dark:text-text-primary-dark">
                  Enable Segments
                </h2>
                <ToggleButton
                  isChecked={segmentsEnabled}
                  setIsChecked={setSegmentsEnabled}
                ></ToggleButton> */}
              </div>

              {/* Segments dropdown */}
              {/* <div
                className={
                  "transition-height overflow-hidden ease-in-out " +
                  (segmentsEnabled
                    ? "h-[156px] duration-300"
                    : "h-0 duration-0")
                }
              >
                <div
                  className={
                    "relative flex flex-col gap-4 bg-black/15 px-2 py-3 duration-300 ease-in-out" +
                    (segmentsEnabled
                      ? "opacity-100 transition-all"
                      : " invisible w-full -translate-y-full opacity-0")
                  }
                >
                  <div className="flex flex-col gap-2">
                    <div className="rounded-lg px-2">
                      <p className="text-sm text-text-primary dark:text-text-primary-dark">
                        Tracker Name
                      </p>
                    </div>
                    <div className="flex rounded-lg bg-white/5 p-2">
                      <p className="text-sm text-text-primary dark:text-text-primary-dark">
                        Stamina
                      </p>
                    </div>
                    <div className=" rounded-lg bg-white/5 p-2"></div>
                  </div>
                  <div className="flex flex-row gap-2 ">
                    <button className="rounded-full px-6 py-1 text-sm text-text-primary outline outline-1 outline-white/30 hover:bg-black/20 dark:text-text-primary-dark">
                      + Health
                    </button>
                  </div>
                </div>
              </div> */}
            </>
          )}

          {/* Report Bug button */}
          <ReportBugButton></ReportBugButton>
        </div>
      </div>
    </div>
  );
}
