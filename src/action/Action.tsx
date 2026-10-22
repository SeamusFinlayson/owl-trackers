import IconButton from "../components/IconButton";
import { Item, Metadata } from "@owlbear-rodeo/sdk";
import ToggleButton from "../components/ToggleButton";
import Input from "../components/Input";
import ActionHeader from "./ActionHeader";
import ReportBugButton from "../components/ReportBugButton";
import { Collapse } from "@mui/material";
import DeleteIcon from "../icons/DeleteIcon";
import { TrackerInput } from "../components/TrackerInput";
import SimplePlusIcon from "../icons/SimplePlusIcon";
import { parseContentForNumber } from "../parseContentForNumber";
import OpenInNewIcon from "../icons/OpenInNewIcon";
import { Settings } from "../state/SettingsZod";
import { getTrackersFromItem } from "../trackerHelpersItem";
import { getTrackersFromSceneMetadata } from "../trackerHelpersScene";
import { openSceneTrackersPopover } from "./openSceneTrackersPopover";
import { Divider } from "../components/Divider";

const getTrackerBarNames = (items: Item[], metadata: Metadata) => {
  const trackerBarNames = new Set<string>();
  for (const item of items) {
    const trackers = getTrackersFromItem(item);
    for (const tracker of trackers) {
      if (tracker.variant === "value-max" && tracker.name !== undefined)
        trackerBarNames.add(tracker.name);
    }
  }

  const trackers = getTrackersFromSceneMetadata(metadata);
  for (const tracker of trackers) {
    if (tracker.variant === "value-max" && tracker.name !== undefined)
      trackerBarNames.add(tracker.name);
  }

  return [...trackerBarNames];
};

export function Action({
  settings,
  roomMetadata,
  items,
  updateSettings,
}: {
  settings: Settings;
  roomMetadata: Metadata;
  items: Item[];
  updateSettings: (settings: Partial<Settings>) => void;
}): React.JSX.Element {
  const verticalOffset = settings.verticalOffset;
  const trackersAboveToken = settings.trackersAboveToken;
  const barHeightIsReduced = settings.barHeightIsReduced;
  const segmentsEnabled = settings.segmentsEnabled;
  const segmentSettings = settings.segmentSettings;

  const trackerBarNames = getTrackerBarNames(items, roomMetadata);

  const trackerNamesWithSegmentsDisabled = trackerBarNames.filter(
    (name) => !segmentSettings.map((value) => value[0]).includes(name),
  );

  return (
    <div>
      <ActionHeader />

      <div className="mx-4 pb-2">
        <Divider title="Scene" />
      </div>

      {/* Settings */}
      <div className="flex w-full flex-col">
        <div className="grid w-full auto-rows-fr grid-cols-[auto_50px] items-center justify-items-center gap-x-1 gap-y-1 px-4">
          {/* Default trackers */}
          <h2 className="text-text-primary dark:text-text-primary-dark justify-self-start text-sm">
            Default trackers
          </h2>
          <IconButton Icon={OpenInNewIcon} onClick={openSceneTrackersPopover} />
        </div>

        <div className="mx-4 pt-3 pb-2">
          <Divider title="Room" />
        </div>

        <div className="grid w-full auto-rows-fr grid-cols-[auto_50px] items-center justify-items-center gap-x-1 gap-y-1 px-4">
          {/* Default trackers */}
          <h2 className="text-text-primary dark:text-text-primary-dark justify-self-start text-sm">
            Vertical Offset
          </h2>
          <Input
            value={verticalOffset}
            updateHandler={(value: number) =>
              updateSettings({ verticalOffset: value })
            }
          />

          {/* Default trackers */}
          <h2 className="text-text-primary dark:text-text-primary-dark justify-self-start text-sm">
            Trackers above token
          </h2>
          <ToggleButton
            isChecked={trackersAboveToken}
            changeHandler={(isChecked: boolean) =>
              updateSettings({ trackersAboveToken: isChecked })
            }
          />

          {/* Default trackers */}
          <h2 className="text-text-primary dark:text-text-primary-dark justify-self-start text-sm">
            Use reduced bar height
          </h2>
          <ToggleButton
            isChecked={barHeightIsReduced}
            changeHandler={(isChecked: boolean) =>
              updateSettings({ barHeightIsReduced: isChecked })
            }
          />

          {/* Segments */}
          <h2 className="text-text-primary dark:text-text-primary-dark justify-self-start text-sm">
            Enable Segments
          </h2>
          <ToggleButton
            isChecked={segmentsEnabled}
            changeHandler={(isChecked: boolean) =>
              updateSettings({ segmentsEnabled: isChecked })
            }
          />
        </div>

        {/* Segments dropdown */}
        <div>
          <Collapse in={segmentsEnabled}>
            <div className={"my-1 flex flex-col gap-2 bg-black/15 p-2"}>
              {segmentSettings.length > 0 && (
                <div className="flex flex-col gap-2">
                  {[...segmentSettings].map((setting) => (
                    <div
                      key={setting[0]}
                      className="overflow-clip rounded-lg bg-white/5 p-2 pb-3 pl-3"
                    >
                      <div className="flex w-full items-start justify-between">
                        <div>
                          <h1 className="text-text-primary dark:text-text-primary-dark">
                            {setting[0]}
                          </h1>
                          <p className="text-text-secondary dark:text-text-secondary-dark text-xs">
                            Segments
                          </p>
                        </div>
                        <IconButton
                          Icon={DeleteIcon}
                          className="rounded-md"
                          onClick={() =>
                            updateSettings({
                              segmentSettings: segmentSettings.filter(
                                (value) => value !== setting,
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-between pt-2 pr-1">
                        <TrackerInput
                          fullWidth
                          value={setting[1].toString()}
                          onConfirm={(content) => {
                            const index = segmentSettings.findIndex(
                              (value) => value[0] === setting[0],
                            );
                            if (index !== -1) {
                              segmentSettings[index][1] = Math.trunc(
                                parseContentForNumber(content, 0, false, {
                                  min: 0,
                                }),
                              );
                              updateSettings({
                                segmentSettings: [...segmentSettings],
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {trackerNamesWithSegmentsDisabled.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2 py-1">
                  {trackerNamesWithSegmentsDisabled.map((name) => (
                    <button
                      key={name}
                      className="text-text-primary dark:text-text-primary-dark flex items-center gap-2 rounded-full px-3 py-1 pl-2 text-sm outline-1 outline-white/30 outline-solid hover:bg-black/20"
                      onClick={() =>
                        updateSettings({
                          segmentSettings: [...segmentSettings, [name, 0]],
                        })
                      }
                    >
                      <SimplePlusIcon />
                      <div className="pt-0.5">{name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Collapse>
        </div>

        <ReportBugButton />
      </div>
    </div>
  );
}
