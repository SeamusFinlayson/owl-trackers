import { create } from "zustand";

interface SceneSettingsState {
  verticalOffset: number;
  trackersAboveToken: boolean;
  barHeightIsReduced: boolean;

  setVerticalOffset: (verticalOffset: number) => void;
  setTrackersAboveToken: (trackersAboveToken: boolean) => void;
  setBarHeightIsReduced: (barHeightIsReduced: boolean) => void;
}

export const useSceneSettingsStore = create<SceneSettingsState>()((set) => ({
  verticalOffset: 0,
  trackersAboveToken: false,
  barHeightIsReduced: false,

  setVerticalOffset: (verticalOffset) =>
    set((state) => ({ ...state, verticalOffset })),
  setTrackersAboveToken: (trackersAboveToken) =>
    set((state) => ({ ...state, trackersAboveToken })),
  setBarHeightIsReduced: (barHeightIsReduced) =>
    set((state) => ({ ...state, barHeightIsReduced })),
}));
