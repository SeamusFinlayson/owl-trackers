import OBR, { Image, Item, Metadata, isImage } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import {
  FULL_BAR_HEIGHT,
  createTrackerBubble,
  createTrackerBar,
  getBarItemIds,
  getBarTextId,
  getBubbleItemIds,
  createImageBubble,
  getImageBubbleItemIds,
  REDUCED_BAR_HEIGHT,
  MINIMAL_BAR_HEIGHT,
  createMinimalTrackerBar,
} from "./compoundItemHelpers";
import {
  getTrackersFromItem,
  getTrackersHiddenFromItem,
} from "../trackerHelpersItem";
import {
  TRACKER_METADATA_ID,
  HIDDEN_METADATA_ID,
  MAX_TRACKER_COUNT,
} from "../trackerHelpersBasic";
import { BubblePosition } from "./trackerPositionHelper";
import {
  BAR_HEIGHT_METADATA_ID,
  SEGMENTS_ENABLED_METADATA_ID,
  TRACKERS_ABOVE_METADATA_ID,
  VERTICAL_OFFSET_METADATA_ID,
  readBooleanFromMetadata,
  readNumberFromMetadata,
} from "../sceneMetadataHelpers";

let tokenIds: string[] = []; // for orphan health bar management
let itemsLast: Image[] = []; // for item change checks
const addItemsArray: Item[] = []; // for bulk addition or changing of items
const deleteItemsArray: string[] = []; // for bulk deletion of scene items
let sceneListenersSet = false;
let userRoleLast: "GM" | "PLAYER";

let verticalOffset = 0;
let trackersAboveToken = false;
let barHeightIsReduced = false;
let segmentsEnabled = true;
let segmentSettings = new Map<string, number>();

export async function initOnMapTrackers() {
  // Handle when the scene is either changed or made ready after extension load
  OBR.scene.onReadyChange(async (isReady) => {
    if (isReady) {
      await getGlobalSettings();
      await getSegmentSettings();
      await refreshAllTrackers();
      await startTrackerUpdates();
    }
  });

  // Check if the scene is already ready once the extension loads
  const isReady = await OBR.scene.isReady();
  if (isReady) {
    await getGlobalSettings();
    await getSegmentSettings();
    await refreshAllTrackers();
    await startTrackerUpdates();
  }
}

/** returns true if global settings have changed */
async function getGlobalSettings(sceneMetadata?: Metadata): Promise<boolean> {
  // load settings from scene metadata if not passed to function
  if (typeof sceneMetadata === "undefined") {
    sceneMetadata = await OBR.scene.getMetadata();
  }

  const [
    newVerticalOffset,
    newTrackersAboveToken,
    newBarHeightIsReduced,
    newSegmentsEnabled,
  ] = [
    readNumberFromMetadata(sceneMetadata, VERTICAL_OFFSET_METADATA_ID),
    readBooleanFromMetadata(sceneMetadata, TRACKERS_ABOVE_METADATA_ID),
    readBooleanFromMetadata(sceneMetadata, BAR_HEIGHT_METADATA_ID),
    readBooleanFromMetadata(sceneMetadata, SEGMENTS_ENABLED_METADATA_ID),
  ];

  const doRefresh =
    newVerticalOffset !== verticalOffset ||
    newTrackersAboveToken !== trackersAboveToken ||
    newBarHeightIsReduced !== barHeightIsReduced ||
    newSegmentsEnabled !== segmentsEnabled;

  verticalOffset = newVerticalOffset;
  trackersAboveToken = newTrackersAboveToken;
  barHeightIsReduced = newBarHeightIsReduced;
  segmentsEnabled = newSegmentsEnabled;

  return doRefresh;
}

/** Returns true is segment settings have changed*/
async function getSegmentSettings(sceneMetadata?: Metadata): Promise<boolean> {
  // load settings from scene metadata if not passed to function
  if (typeof sceneMetadata === "undefined") {
    sceneMetadata = await OBR.scene.getMetadata();
  }

  let doRefresh = false;

  const newSegmentSettings = sceneMetadata[getPluginId("segmentSettings")] as
    | [string, number][]
    | undefined;
  if (newSegmentSettings !== undefined) {
    if (newSegmentSettings.length !== segmentSettings.size) doRefresh = true;
    for (const setting of newSegmentSettings) {
      if (
        !segmentSettings.has(setting[0]) ||
        segmentSettings.get(setting[0]) !== setting[1]
      )
        doRefresh = true;
    }
    segmentSettings = new Map(newSegmentSettings);
  }

  return doRefresh;
}

async function refreshAllTrackers() {
  //get shapes from scene
  const items: Image[] = await OBR.scene.items.getItems(
    (item) =>
      (item.layer === "CHARACTER" || item.layer === "MOUNT") && isImage(item),
  );

  //store array of all items currently on the board for change monitoring
  itemsLast = items;

  //draw health bars
  const roll = await OBR.player.getRole();
  const sceneDpi = await OBR.scene.grid.getDpi();
  for (const item of items) {
    await updateItemTrackers(item, roll, sceneDpi);
  }

  await OBR.scene.local.deleteItems(deleteItemsArray); //bulk delete items
  await OBR.scene.local.addItems(addItemsArray); //bulk add items
  //clear add and delete arrays arrays
  addItemsArray.length = 0;
  deleteItemsArray.length = 0;

  //update global item id list for orphaned health bar monitoring
  const itemIds: string[] = [];
  for (const item of items) {
    itemIds.push(item.id);
  }
  tokenIds = itemIds;
}

async function startTrackerUpdates() {
  if (!sceneListenersSet) {
    // Don't run this again unless the listeners have been unsubscribed
    sceneListenersSet = true;

    // Initialize previous user role
    userRoleLast = await OBR.player.getRole();

    // Handle role changes
    const unSubscribeFromPlayer = OBR.player.onChange((player) => {
      // Do a refresh if player role change is detected
      if (player.role !== userRoleLast) {
        refreshAllTrackers();
        userRoleLast = player.role;
      }
    });

    // Handle Global settings changes
    const unsubscribeFromSceneMetadata = OBR.scene.onMetadataChange(
      async (metadata) => {
        const globalSettingsChanged = await getGlobalSettings(metadata);
        const segmentSettingsChanged = await getSegmentSettings(metadata);
        if (globalSettingsChanged || segmentSettingsChanged)
          refreshAllTrackers();
      },
    );

    // Handle item changes (Update health bars)
    const unsubscribeFromItems = OBR.scene.items.onChange(
      async (itemsFromCallback) => {
        // Filter items for only images from character and mount layers
        const imagesFromCallback: Image[] = [];
        for (const item of itemsFromCallback) {
          if (
            (item.layer === "CHARACTER" || item.layer === "MOUNT") &&
            isImage(item)
          ) {
            imagesFromCallback.push(item);
          }
        }

        //get rid of tracker attachments that no longer attach to anything
        deleteOrphanAttachments(imagesFromCallback);

        const changedItems = getChangedItems(imagesFromCallback);

        //update array of all items currently on the board
        itemsLast = imagesFromCallback;

        //draw health bars
        const role = await OBR.player.getRole();
        const sceneDpi = await OBR.scene.grid.getDpi();

        for (const item of changedItems) {
          await updateItemTrackers(item, role, sceneDpi);
        }

        await OBR.scene.local.deleteItems(deleteItemsArray); //bulk delete items
        await OBR.scene.local.addItems(addItemsArray); //bulk add items

        //clear add and delete arrays arrays
        addItemsArray.length = 0;
        deleteItemsArray.length = 0;
      },
    );

    // Unsubscribe listeners that rely on the scene if it stops being ready
    const unsubscribeFromSceneReady = OBR.scene.onReadyChange((isReady) => {
      if (!isReady) {
        unSubscribeFromPlayer();
        unsubscribeFromSceneMetadata();
        unsubscribeFromItems();
        unsubscribeFromSceneReady();
        sceneListenersSet = false;
      }
    });
  }
}

function getChangedItems(items: Image[]): Image[] {
  const changedItems: Image[] = [];

  let s = 0; // # items skipped in itemsLast array, caused by deleted items

  for (let i = 0; i < items.length; i++) {
    //check for new items at the end of the list
    if (i > itemsLast.length - 1 - s) {
      changedItems.push(items[i]);
    } else if (itemsLast[i + s].id !== items[i].id) {
      s++; // Skip an index in itemsLast
      i--; // Reuse the index item in imagesFromCallback
      //check for scaling changes
    } else if (
      !(
        itemsLast[i + s].scale.x === items[i].scale.x &&
        itemsLast[i + s].scale.y === items[i].scale.y
      )
    ) {
      // Bar text attachments must be deleted to prevent ghost selection highlight bug
      deleteItemsArray.push(
        ...Array(MAX_TRACKER_COUNT)
          .fill(undefined)
          .map((_, barIndex) => getBarTextId(items[i].id, barIndex)),
      );
      changedItems.push(items[i]);
    } else if (
      //check position, visibility, and metadata changes
      !(
        itemsLast[i + s].position.x === items[i].position.x &&
        itemsLast[i + s].position.y === items[i].position.y &&
        itemsLast[i + s].visible === items[i].visible &&
        JSON.stringify(
          itemsLast[i + s].metadata[getPluginId(TRACKER_METADATA_ID)],
        ) ===
          JSON.stringify(items[i].metadata[getPluginId(TRACKER_METADATA_ID)]) &&
        JSON.stringify(
          itemsLast[i + s].metadata[getPluginId(HIDDEN_METADATA_ID)],
        ) === JSON.stringify(items[i].metadata[getPluginId(HIDDEN_METADATA_ID)])
      )
    ) {
      //update items
      changedItems.push(items[i]);
    }
  }

  return changedItems;
}

async function updateItemTrackers(
  item: Image,
  role: "PLAYER" | "GM",
  sceneDpi: number,
) {
  // Extract metadata from the token
  const trackers = getTrackersFromItem(item);
  const trackersHidden = getTrackersHiddenFromItem(item);

  if (
    (role === "GM" && trackers.length === 0 && !trackersHidden) ||
    (role === "PLAYER" && trackers.length === 0) ||
    (role === "PLAYER" && trackersHidden && !segmentsEnabled)
  ) {
    // Display nothing, delete any existing tracker attachments
    addAllItemAttachmentsToDeleteList(item.id);
  } else if (role === "PLAYER" && trackersHidden) {
    // Display limited trackers depending on GM configuration
    console.log("Experimental limited view being displayed");
    createPlayerVisibleTrackers();
  } else {
    // Display full trackers
    createAllTrackers();
  }

  function createPlayerVisibleTrackers() {
    // Determine token bounds
    const bounds = getImageBounds(item, sceneDpi);
    bounds.width = Math.abs(bounds.width);
    bounds.height = Math.abs(bounds.height);

    // Determine coordinate origin for drawing stats
    const origin = {
      x: item.position.x,
      y: item.position.y - (trackersAboveToken ? bounds.height : 0),
    };

    const barHeight = MINIMAL_BAR_HEIGHT;

    // Add bar trackers
    const segmentSettingsNames = [...segmentSettings.keys()];
    const barTrackers = trackers.filter(
      (tracker) =>
        tracker.name !== undefined &&
        segmentSettingsNames.includes(tracker.name) &&
        tracker.showOnMap !== false &&
        tracker.variant === "value-max",
    );

    barTrackers.map((tracker, index) => {
      if (tracker.name !== undefined && segmentSettings.has(tracker.name)) {
        addItemsArray.push(
          ...createMinimalTrackerBar(
            item,
            bounds,
            tracker,
            {
              x: origin.x,
              y:
                origin.y -
                index * barHeight +
                bounds.height / 2 -
                verticalOffset,
            },
            segmentSettings.get(tracker.name),
            index,
          ),
        );
      }
    });

    // Clean up extra bars
    for (let i = barTrackers.length; i < MAX_TRACKER_COUNT; i++) {
      deleteItemsArray.push(...getBarItemIds(item.id, i));
    }

    // Delete all bar text attachments
    for (let i = 0; i < MAX_TRACKER_COUNT; i++) {
      deleteItemsArray.push(getBarTextId(item.id, i));
    }

    // Delete all bubbles
    addAllBubbleTrackersToDeleteList(item.id);

    // Delete Hide bubble
    addHideBubbleToDeleteList(item.id);
  }

  function createAllTrackers() {
    // Determine token bounds
    const bounds = getImageBounds(item, sceneDpi);
    bounds.width = Math.abs(bounds.width);
    bounds.height = Math.abs(bounds.height);

    // Determine coordinate origin for drawing stats
    const origin = {
      x: item.position.x,
      y: item.position.y - (trackersAboveToken ? bounds.height : 0),
    };

    const barHeight = barHeightIsReduced ? REDUCED_BAR_HEIGHT : FULL_BAR_HEIGHT;

    // Add bar trackers

    const barTrackers = trackers.filter(
      (tracker) =>
        tracker.showOnMap !== false && tracker.variant === "value-max",
    );
    barTrackers.map((tracker, index) => {
      if (tracker.showOnMap === false) {
        // console.log("hidden", barIndex);
        deleteItemsArray.push(...getBarItemIds(item.id, index));
      } else {
        addItemsArray.push(
          ...createTrackerBar(
            item,
            bounds,
            tracker,
            {
              x: origin.x,
              y:
                origin.y -
                index * barHeight +
                bounds.height / 2 -
                verticalOffset,
            },
            index,
            barHeightIsReduced,
          ),
        );
      }
    });

    // Clean up extra bars
    for (let i = barTrackers.length; i < MAX_TRACKER_COUNT; i++) {
      deleteItemsArray.push(...getBarItemIds(item.id, i));
    }

    const bubblePosition = new BubblePosition(
      origin,
      bounds,
      barTrackers.length,
      barHeight,
      trackersAboveToken,
    );

    // Add hidden indicator
    if (!trackersHidden) {
      deleteItemsArray.push(...getImageBubbleItemIds(item.id, "hide"));
    } else {
      const position = bubblePosition.getNew();
      const hideIndicator = createImageBubble(
        item,
        sceneDpi,
        { x: position.x, y: position.y - verticalOffset },
        "black",
        "https://raw.githubusercontent.com/SeamusFinlayson/owl-trackers/main/src/assets/visibility_off.png",
        "hide",
      );
      addItemsArray.push(...hideIndicator);
    }

    // Add bubble trackers
    const bubbleTrackers = trackers.filter(
      (tracker) =>
        (tracker.showOnMap !== false && tracker.variant === "value") ||
        tracker.variant === "counter",
    );

    bubbleTrackers.map((tracker, index) => {
      if (tracker.showOnMap === false) {
        deleteItemsArray.push(...getBubbleItemIds(item.id, index));
      } else {
        const position = bubblePosition.getNew();
        addItemsArray.push(
          ...createTrackerBubble(
            item,
            tracker,
            {
              x: position.x,
              y: position.y - verticalOffset,
            },
            index,
          ),
        );
      }
    });

    for (let i = bubbleTrackers.length; i < MAX_TRACKER_COUNT; i++) {
      deleteItemsArray.push(...getBubbleItemIds(item.id, i));
    }
  }
}

const getImageBounds = (item: Image, dpi: number) => {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
};

function deleteOrphanAttachments(newItems: Image[]) {
  const newItemIds: string[] = [];
  for (const item of newItems) {
    newItemIds.push(item.id);
  }

  //check for orphaned health bars
  for (const oldId of tokenIds) {
    if (!newItemIds.includes(oldId)) {
      // delete orphaned health bar
      addAllItemAttachmentsToDeleteList(oldId);
    }
  }

  // update item list with current values
  tokenIds = newItemIds;
}

function addAllItemAttachmentsToDeleteList(itemId: string) {
  for (let i = 0; i < MAX_TRACKER_COUNT; i++) {
    deleteItemsArray.push(...getBarItemIds(itemId, i));
  }
  addAllBubbleTrackersToDeleteList(itemId);
  addHideBubbleToDeleteList(itemId);
}

function addAllBubbleTrackersToDeleteList(itemId: string) {
  for (let i = 0; i < MAX_TRACKER_COUNT; i++) {
    deleteItemsArray.push(...getBubbleItemIds(itemId, i));
  }
}

function addHideBubbleToDeleteList(itemId: string) {
  deleteItemsArray.push(...getImageBubbleItemIds(itemId, "hide"));
}
