import { useOwlbearStore } from "../useOwlbearStore.ts";
import { useOwlbearStoreSync } from "../useOwlbearStoreSync.ts";
import "../index.css";
import { Action } from "./Action.tsx";
import IconButton from "../components/IconButton.tsx";
import MoreIcon from "../icons/MoreIcon.tsx";
import { getPluginId } from "../getPluginId.ts";
import OBR from "@owlbear-rodeo/sdk";

export default function App(): JSX.Element {
  useOwlbearStoreSync();

  return (
    <Action>
      <h1>Set scene default trackers</h1>
      <IconButton
        Icon={MoreIcon}
        onClick={() =>
          OBR.popover.open({
            id: getPluginId("editor"),
            url: "/src/action/editor.html",
            height: 600,
            width: 500,
            anchorOrigin: { horizontal: "CENTER", vertical: "CENTER" },
            transformOrigin: { horizontal: "CENTER", vertical: "CENTER" },
          })
        }
      ></IconButton>
      <h1>setting</h1>
      <button className="bg-black/20 hover:bg-black/30">Press</button>
    </Action>
  );
}
