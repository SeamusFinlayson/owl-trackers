import { useOwlbearStore } from "../useOwlbearStore";
import HeaderButton from "../components/HeaderButton";
import IconButton from "../components/IconButton";
import MoreIcon from "../icons/MoreIcon";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";

export function Action(): JSX.Element {
  const mode = useOwlbearStore((state) => state.mode);

  return (
    <div className={mode === "DARK" ? "dark" : ""}>
      <div className="m-4 grid grid-cols-[minmax(120px,_auto)_repeat(3,_42px)] items-center p-0">
        <p className="m-0 text-xl font-bold tracking-[0px] text-text-primary dark:text-text-primary-dark">
          Owl Trackers
        </p>

        <HeaderButton variant="patreon"></HeaderButton>

        <HeaderButton variant="changeLog"></HeaderButton>

        <HeaderButton variant="help"></HeaderButton>
      </div>

      <hr className="mx-[16px] my-[12px] border-text-primary dark:border-text-primary-dark/10"></hr>

      <div className="w-full px-4">
        <div className="grid w-full grid-cols-[auto_50px] items-center justify-items-end gap-x-1 gap-y-4">
          <h1 className="justify-self-start text-text-primary dark:text-text-primary-dark">
            Set scene default trackers
          </h1>
          <IconButton
            Icon={MoreIcon}
            onClick={() =>
              OBR.popover.open({
                id: getPluginId("editor"),
                url: "/src/sceneEditor/sceneEditor.html",
                height: 600,
                width: 500,
                anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
                transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
              })
            }
          ></IconButton>
        </div>
      </div>

      <div className="m-4 flex flex-row gap-2">
        <a
          className="flex flex-row items-center gap-2 rounded-lg border-none bg-black/15 p-2 text-center text-text-primary no-underline dark:text-text-primary-dark"
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
            stroke-width="0.00048000000000000007"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
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
  );
}
