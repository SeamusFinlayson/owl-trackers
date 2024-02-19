import OBR, { Image, Item, isImage } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
import {
  BUBBLE_DIAMETER,
  FULL_BAR_HEIGHT,
  createTrackerBubble,
  createTrackerBar,
  getBarItemIds,
  getBarTextId,
  getBubbleItemIds,
  createImageBubble,
  getImageBubbleItemIds,
} from "./compoundItemHelpers";
import {
  HIDDEN_METADATA_ID,
  MAX_BAR_COUNT,
  MAX_BUBBLE_COUNT,
  TRACKER_METADATA_ID,
  getTrackersFromItem,
} from "../itemHelpers";

let tokenIds: string[] = []; // for orphan health bar management
let itemsLast: Image[] = []; // for item change checks
const addItemsArray: Item[] = []; // for bulk addition or changing of items
const deleteItemsArray: string[] = []; // for bulk deletion of scene items
let sceneListenersSet = false;
let userRoleLast: "GM" | "PLAYER";

export async function initOnMapTrackers() {
  // Handle when the scene is either changed or made ready after extension load
  OBR.scene.onReadyChange(async (isReady) => {
    if (isReady) {
      await refreshAllTrackers();
      await startTrackerUpdates();
    }
  });

  // Check if the scene is already ready once the extension loads
  const isReady = await OBR.scene.isReady();
  if (isReady) {
    await refreshAllTrackers();
    await startTrackerUpdates();
  }
}

async function refreshAllTrackers() {
  //get shapes from scene
  const items: Image[] = await OBR.scene.items.getItems(
    (item) =>
      (item.layer === "CHARACTER" || item.layer === "MOUNT") && isImage(item),
  );
  // console.log(items);

  //store array of all items currently on the board for change monitoring
  itemsLast = items;

  //draw health bars
  const roll = await OBR.player.getRole();
  const sceneDpi = await OBR.scene.grid.getDpi();
  for (const item of items) {
    await updateItemTrackers(item, roll, sceneDpi);
  }

  OBR.scene.local.addItems(addItemsArray); //bulk add items
  OBR.scene.local.deleteItems(deleteItemsArray); //bulk delete items
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
    const unSubscribeFromPlayer = OBR.player.onChange(async () => {
      // Do a refresh if player role change is detected
      const userRole = await OBR.player.getRole();
      if (userRole !== userRoleLast) {
        refreshAllTrackers();
        userRoleLast = userRole;
      }
    });

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

        //get rid of health bars that no longer attach to anything
        deleteOrphanHealthBars(imagesFromCallback);

        const changedItems = getChangedItems(imagesFromCallback);

        //update array of all items currently on the board
        itemsLast = imagesFromCallback;

        //draw health bars
        const role = await OBR.player.getRole();
        const sceneDpi = await OBR.scene.grid.getDpi();

        for (const item of changedItems) {
          await updateItemTrackers(item, role, sceneDpi);
        }

        //bulk delete items
        await OBR.scene.local.deleteItems(deleteItemsArray);

        //bulk add items
        await OBR.scene.local.addItems(addItemsArray);

        //clear add and delete arrays arrays
        addItemsArray.length = 0;
        deleteItemsArray.length = 0;
      },
    );

    // Unsubscribe listeners that rely on the scene if it stops being ready
    const unsubscribeFromScene = OBR.scene.onReadyChange((isReady) => {
      if (!isReady) {
        unSubscribeFromPlayer();
        unsubscribeFromItems();
        unsubscribeFromScene();
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

  // Explicitly delete all attachment and return early if none are assigned to this item
  const noAttachments = () =>
    (role === "PLAYER" && trackersHidden) ||
    (trackers.length === 0 && !trackersHidden);
  if (noAttachments()) {
    addAllItemAttachmentsToDeleteList(item.id);
    return;
  }

  // Determine token bounds
  const bounds = getImageBounds(item, sceneDpi);
  bounds.width = Math.abs(bounds.width);
  bounds.height = Math.abs(bounds.height);

  // Determine coordinate origin for drawing stats
  const origin = {
    x: item.position.x,
    y: item.position.y,
  };

  // Add bar trackers
  let barCount = 0;
  trackers.map((tracker) => {
    if (tracker.variant !== "value-max") {
      () => {};
    } else if (!tracker.showOnMap) {
      deleteItemsArray.push(...getBarItemIds(item.id, tracker.position));
    } else {
      addItemsArray.push(
        ...createTrackerBar(item, bounds, tracker, {
          x: origin.x,
          y: origin.y - barCount * FULL_BAR_HEIGHT + bounds.height / 2,
        }),
      );
      barCount++;
    }
  });

  // Clean up extra bars
  for (let i = barCount; i < MAX_BAR_COUNT; i++) {
    deleteItemsArray.push(...getBarItemIds(item.id, i));
  }

  let bubblePositionInRow = 0;
  // let bubbleRowsCount = 0;
  const getBubblePosition = () => {
    // if ((bubblePositionInRow + 1) * (BUBBLE_DIAMETER + 2) > bounds.width) {
    //   bubbleRowsCount++;
    //   bubblePositionInRow = 0;
    // }

    const position = {
      x:
        origin.x +
        2 -
        bounds.width / 2 +
        bubblePositionInRow * (BUBBLE_DIAMETER + 2) +
        BUBBLE_DIAMETER / 2,
      y:
        origin.y -
        2 -
        BUBBLE_DIAMETER / 2 -
        // bubbleRowsCount * (BUBBLE_DIAMETER + 2) -
        barCount * FULL_BAR_HEIGHT +
        bounds.height / 2,
    };

    // console.log(position);

    bubblePositionInRow++;
    return position;
  };

  if (!trackersHidden) {
    deleteItemsArray.push(...getImageBubbleItemIds(item.id, "hide"));
  } else {
    const hideIndicator = createImageBubble(
      item,
      sceneDpi,
      bounds,
      // origin,
      getBubblePosition(),
      "black",
      "https://raw.githubusercontent.com/SeamusFinlayson/owl-trackers/main/src/assets/visibility_off.png",
      "hide",
    );
    addItemsArray.push(...hideIndicator);
  }

  // Add bubble trackers
  trackers.map((tracker) => {
    if (tracker.variant !== "value") {
      () => {};
    } else if (!tracker.showOnMap) {
      deleteItemsArray.push(...getBubbleItemIds(item.id, tracker.position));
    } else {
      addItemsArray.push(
        ...createTrackerBubble(item, bounds, tracker, getBubblePosition()),
      );
    }
  });

  // Clean up extra bubbles
  for (
    let i = bubblePositionInRow - (trackersHidden ? 1 : 0);
    i < MAX_BUBBLE_COUNT;
    i++
  ) {
    deleteItemsArray.push(...getBubbleItemIds(item.id, i));
  }
}

const getImageBounds = (item: Image, dpi: number) => {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
};

function deleteOrphanHealthBars(newItems: Image[]) {
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
  for (let i = 0; i < MAX_BUBBLE_COUNT; i++) {
    deleteItemsArray.push(...getBubbleItemIds(itemId, i));
  }
  for (let i = 0; i < MAX_BAR_COUNT; i++) {
    deleteItemsArray.push(...getBarItemIds(itemId, i));
  }
  deleteItemsArray.push(...getImageBubbleItemIds(itemId, "hide"));
}
