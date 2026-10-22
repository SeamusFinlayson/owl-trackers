import { Settings } from "./SettingsZod";
import { TrackersState } from "./TrackersStateType";

export const defaultSettings: Settings = {
  verticalOffset: 0,
  trackersAboveToken: false,
  barHeightIsReduced: false,
  segmentsEnabled: false,
  segmentSettings: [],
};

export const defaultTrackersState: TrackersState = {
  sceneIsReady: false,
  items: [],
  selection: undefined,
  sceneMetadata: {},
  roomMetadata: {},
  playerRole: undefined,
  theme: undefined,

  selectedItem: undefined,
  selectionTrackers: undefined,
  selectionTrackersHidden: undefined,
  sceneTrackers: undefined,
  settings: defaultSettings,
};
