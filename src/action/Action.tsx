import { useOwlbearStore } from "../useOwlbearStore";
import HeaderButton from "../components/HeaderButton";
import IconButton from "../components/IconButton";
import MoreIcon from "../icons/MoreIcon";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import ToggleButton from "../components/ToggleButton";
import { useEffect, useState } from "react";
import Input from "../components/Input";
import {
  BAR_HEIGHT_METADATA_ID,
  TRACKERS_ABOVE_METADATA_ID,
  VERTICAL_OFFSET_METADATA_ID,
  readBooleanFromMetadata,
  readNumberFromMetadata,
} from "../sceneMetadataHelpers";

export function Action({
  initialVerticalOffset,
  initialTrackersAboveToken,
  initialBarHeightIsReduced,
}: {
  initialVerticalOffset: number;
  initialTrackersAboveToken: boolean;
  initialBarHeightIsReduced: boolean;
}): JSX.Element {
  const mode = useOwlbearStore((state) => state.mode);
  const role = useOwlbearStore((state) => state.role);

  useEffect(() => {
    if (role === "GM") OBR.action.setHeight(313);
    else OBR.action.setHeight(197);
  }, [role]);

  const [verticalOffset, setVerticalOffset] = useState(initialVerticalOffset);
  const [trackersAboveToken, setTrackersAboveToken] = useState(
    initialTrackersAboveToken,
  );
  const [barHeightIsReduced, setBarHeightIsReduced] = useState(
    initialBarHeightIsReduced,
  );

  useEffect(
    () =>
      OBR.scene.onMetadataChange((metadata) => {
        setVerticalOffset(
          readNumberFromMetadata(metadata, VERTICAL_OFFSET_METADATA_ID),
        );
        setTrackersAboveToken(
          readBooleanFromMetadata(metadata, TRACKERS_ABOVE_METADATA_ID),
        );
        setBarHeightIsReduced(
          readBooleanFromMetadata(metadata, BAR_HEIGHT_METADATA_ID),
        );
      }),
    [],
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
        <div className="grid grid-cols-[minmax(120px,_auto)_repeat(3,_42px)] items-center p-4">
          <h1 className="m-0 text-lg font-bold tracking-[0px] text-text-primary dark:text-text-primary-dark">
            Owl Trackers
          </h1>

          <HeaderButton variant="patreon"></HeaderButton>

          <HeaderButton variant="changeLog"></HeaderButton>

          <HeaderButton variant="help"></HeaderButton>
        </div>

        <hr className="mx-4 my-0 border-text-primary dark:border-text-primary-dark/10"></hr>

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
                      height: 600,
                      width: 500,
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
          <div className="flex flex-row gap-2 px-4 py-3">
            <a
              className="flex flex-row items-center gap-2 rounded-lg border-none bg-black/15 p-2 text-center text-text-primary no-underline hover:bg-black/35 dark:text-text-primary-dark"
              title=""
              href="https://discord.gg/WMp9bky4be"
              target="_blank"
              rel="noreferrer noopener"
            >
              <svg
                className="fill-text-primary stroke-text-primary dark:fill-text-primary-dark dark:stroke-text-primary-dark"
                height="22px"
                width="22px"
                viewBox="0 0 48.00 48.00"
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                transform="rotate(0)"
                stroke="#ffffff"
                strokeWidth="0.00048000000000000007"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>bug-solid</title>{" "}
                  <g id="Layer_2" data-name="Layer 2">
                    {" "}
                    <g id="invisible_box" data-name="invisible box">
                      {" "}
                      <rect width="48" height="48" fill="none"></rect>{" "}
                    </g>{" "}
                    <g id="icons_Q2" data-name="icons Q2">
                      {" "}
                      <path d="M42,32a2,2,0,0,0,0-4H35.9a15.7,15.7,0,0,0-.4-2.3A10,10,0,0,0,43,16a2,2,0,0,0-4,0,6.1,6.1,0,0,1-4.7,5.9,13.6,13.6,0,0,0-3-4.6A7.2,7.2,0,0,0,32,14a8.7,8.7,0,0,0-1-3.9h0a4,4,0,0,1,4-4,2,2,0,0,0,0-4,8.1,8.1,0,0,0-7.4,4.9,7.7,7.7,0,0,0-7.2,0A8.1,8.1,0,0,0,13,2a2,2,0,0,0,0,4,4,4,0,0,1,4,4h0A8.7,8.7,0,0,0,16,14a7.5,7.5,0,0,0,.7,3.3,16.1,16.1,0,0,0-3,4.5A5.9,5.9,0,0,1,9,16a2,2,0,0,0-4,0,10.2,10.2,0,0,0,7.5,9.7,15.7,15.7,0,0,0-.4,2.3H6a2,2,0,0,0,0,4h6.1a15.7,15.7,0,0,0,.4,2.3A10.2,10.2,0,0,0,5,44a2,2,0,0,0,4,0,6.1,6.1,0,0,1,4.7-5.9c2,4.7,5.9,7.9,10.3,7.9s8.3-3.2,10.3-7.9A6,6,0,0,1,39,44a2,2,0,0,0,4,0,10.2,10.2,0,0,0-7.5-9.7,15.7,15.7,0,0,0,.4-2.3ZM26,40a2,2,0,0,1-4,0V20a2,2,0,0,1,2-2,2.1,2.1,0,0,1,2,2Z"></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>

              <p className="settings-label">Report Bug</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
