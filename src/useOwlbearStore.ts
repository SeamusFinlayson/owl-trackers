import { Item, Player } from "@owlbear-rodeo/sdk";
import { create } from "zustand";

interface OwlbearState {
  sceneReady: boolean;
  items: Item[];
  role: Player["role"];
  selection: Player["selection"];
  mode: "DARK" | "LIGHT";

  setSceneReady: (ready: boolean) => void;
  setItems: (items: Item[]) => void;
  setRole: (role: Player["role"]) => void;
  setSelection: (selection: Player["selection"]) => void;
  setMode: (mode: "DARK" | "LIGHT") => void;
}

export const useOwlbearStore = create<OwlbearState>()((set) => ({
  items: [],
  role: "PLAYER",
  sceneReady: false,
  selection: undefined,
  mode: "LIGHT",

  setSceneReady: (sceneReady) => set((state) => ({ ...state, sceneReady })),
  setItems: (items) => set((state) => ({ ...state, items })),
  setRole: (role) => set((state) => ({ ...state, role })),
  setSelection: (selection) => set((state) => ({ ...state, selection })),
  setMode: (mode) => set((state) => ({ ...state, mode })),
}));
