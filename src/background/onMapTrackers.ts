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
import { getTrackersFromItem } from "../trackerHelpersItem";
import {
  MAX_BAR_COUNT,
  TRACKER_METADATA_ID,
  HIDDEN_METADATA_ID,
  MAX_BUBBLE_COUNT,
} from "../trackerHelpersBasic";
import { BubblePosition } from "./trackerPositionHelper";
import {
  BAR_HEIGHT_METADATA_ID,
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
const segmentsEnabled = false;
// const segmentSettingsArray: [string, number][] = [
//   ["health", 2],
//   ["drive", 0],
// ];
// const segmentSettings = new Map<string, number>(segmentSettingsArray);
// console.log(segmentSettings);
const segmentSettings = new Map<string, number>([]);

export async function initOnMapTrackers() {
  // Handle when the scene is either changed or made ready after extension load
  OBR.scene.onReadyChange(async (isReady) => {
    if (isReady) {
      await getGlobalSettings();
      await refreshAllTrackers();
      await startTrackerUpdates();
    }
  });

  // Check if the scene is already ready once the extension loads
  const isReady = await OBR.scene.isReady();
  if (isReady) {
    await getGlobalSettings();
    await refreshAllTrackers();
    await startTrackerUpdates();
  }
}

async function getGlobalSettings(sceneMetadata?: Metadata): Promise<boolean> {
  // load settings from scene metadata if not passed to function
  if (typeof sceneMetadata === "undefined") {
    sceneMetadata = await OBR.scene.getMetadata();
  }

  const [newVerticalOffset, newTrackersAboveToken, newBarHeightIsReduced] = [
    readNumberFromMetadata(sceneMetadata, VERTICAL_OFFSET_METADATA_ID),
    readBooleanFromMetadata(sceneMetadata, TRACKERS_ABOVE_METADATA_ID),
    readBooleanFromMetadata(sceneMetadata, BAR_HEIGHT_METADATA_ID),
  ];

  const doRefresh =
    newVerticalOffset !== verticalOffset ||
    newTrackersAboveToken !== trackersAboveToken ||
    newBarHeightIsReduced !== barHeightIsReduced;

  verticalOffset = newVerticalOffset;
  trackersAboveToken = newTrackersAboveToken;
  barHeightIsReduced = newBarHeightIsReduced;

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
        if (await getGlobalSettings(metadata)) refreshAllTrackers();
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
        ...Array(MAX_BAR_COUNT)
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
  const [trackers, trackersHidden] = getTrackersFromItem(item);

  if (
    (role === "GM" && trackers.length === 0 && !trackersHidden) ||
    (role === "PLAYER" && trackers.length === 0) ||
    (role === "PLAYER" && trackersHidden && !segmentsEnabled)
  ) {
    // Display nothing, delete any existing tracker attachments
    addAllItemAttachmentsToDeleteList(item.id);
  } else if (role === "PLAYER" && trackersHidden) {
    // Display limited trackers depending on GM configuration
    console.log("Warning: limited view available");
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
    let barIndex = 0;
    let barCount = 0;
    trackers.map((tracker) => {
      if (tracker.variant !== "value-max") {
        () => {};
      } else if (!tracker.showOnMap) {
        deleteItemsArray.push(...getBarItemIds(item.id, barIndex));
      } else if (segmentSettings.has(tracker.name)) {
        addItemsArray.push(
          ...createMinimalTrackerBar(
            item,
            bounds,
            tracker,
            {
              x: origin.x,
              y:
                origin.y -
                barCount * barHeight +
                bounds.height / 2 -
                verticalOffset,
            },
            segmentSettings.get(tracker.name),
          ),
        );
        barCount++;
      }
      barIndex++;
    });

    // Clean up extra bars
    for (; barIndex < MAX_BAR_COUNT; barIndex++) {
      deleteItemsArray.push(...getBarItemIds(item.id, barIndex));
    }

    // Delete all bar text attachments
    for (let i = 0; i < MAX_BAR_COUNT; i++) {
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
    let barIndex = 0;
    let barCount = 0;
    let bubbleCount = 0;
    trackers.forEach((tracker) => {
      if (tracker.variant === "value") bubbleCount++;
    });
    trackers.map((tracker) => {
      if (tracker.variant !== "value-max") {
        () => {};
      } else if (!tracker.showOnMap) {
        console.log("hidden", barIndex);
        deleteItemsArray.push(
          ...getBarItemIds(item.id, barIndex - bubbleCount),
        );
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
                barCount * barHeight +
                bounds.height / 2 -
                verticalOffset,
            },
            barHeightIsReduced,
          ),
        );
        barCount++;
      }
      barIndex++;
    });

    // Clean up extra bars
    for (; barIndex - bubbleCount < MAX_BAR_COUNT; barIndex++) {
      console.log(barIndex - bubbleCount);
      deleteItemsArray.push(...getBarItemIds(item.id, barIndex - bubbleCount));
    }

    const bubblePosition = new BubblePosition(
      origin,
      bounds,
      barCount,
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
        bounds,
        { x: position.x, y: position.y - verticalOffset },
        "black",
        "https://raw.githubusercontent.com/SeamusFinlayson/owl-trackers/main/src/assets/visibility_off.png",
        "hide",
      );
      addItemsArray.push(...hideIndicator);
    }

    // Add bubble trackers
    let bubbleIndex = 0;
    trackers.map((tracker) => {
      if (tracker.variant !== "value") {
        () => {};
      } else if (!tracker.showOnMap) {
        deleteItemsArray.push(...getBubbleItemIds(item.id, bubbleIndex));
        () => {};
      } else {
        const position = bubblePosition.getNew();
        addItemsArray.push(
          ...createTrackerBubble(item, bounds, tracker, {
            x: position.x,
            y: position.y - verticalOffset,
          }),
        );
      }
      bubbleIndex++;
    });

    // Clean up extra bubbles
    for (; bubbleIndex - barCount < MAX_BUBBLE_COUNT; bubbleIndex++) {
      // console.log(bubbleIndex - barCount);
      deleteItemsArray.push(
        ...getBubbleItemIds(item.id, bubbleIndex - barCount),
      );
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
  for (let i = 0; i < MAX_BAR_COUNT; i++) {
    deleteItemsArray.push(...getBarItemIds(itemId, i));
  }
  addAllBubbleTrackersToDeleteList(itemId);
  addHideBubbleToDeleteList(itemId);
}

function addAllBubbleTrackersToDeleteList(itemId: string) {
  for (let i = 0; i < MAX_BUBBLE_COUNT; i++) {
    deleteItemsArray.push(...getBubbleItemIds(itemId, i));
  }
}

function addHideBubbleToDeleteList(itemId: string) {
  deleteItemsArray.push(...getImageBubbleItemIds(itemId, "hide"));
}
