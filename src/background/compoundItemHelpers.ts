import {
  AttachmentBehavior,
  Image,
  Item,
  buildImage,
  buildShape,
  buildText,
} from "@owlbear-rodeo/sdk";
import { Tracker } from "../itemHelpers";
import { getColor } from "../colorHelpers";

// Constants used in multiple functions
const FONT_SIZE = 22;
const FONT = "Roboto, sans-serif";
const DISABLE_HIT = true;
const BACKGROUND_OPACITY = 0.6;
const DISABLE_ATTACHMENT_BEHAVIORS: AttachmentBehavior[] = [
  "ROTATION",
  "VISIBLE",
  "COPY",
  "SCALE",
];
const TEXT_VERTICAL_OFFSET = 2;

// Constants used in createStatBubble()
export const BUBBLE_DIAMETER = 30;
const CIRCLE_FONT_SIZE = BUBBLE_DIAMETER - 8;
const REDUCED_CIRCLE_FONT_SIZE = BUBBLE_DIAMETER - 15;
const CIRCLE_TEXT_HEIGHT = BUBBLE_DIAMETER + 0;

/** Creates Stat Bubble component items */
export function createTrackerBubble(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  position: { x: number; y: number },
): Item[] {
  const bubbleShape = buildShape()
    .width(bounds.width)
    .height(BUBBLE_DIAMETER)
    .shapeType("CIRCLE")
    .fillColor(getColor(tracker.color))
    .fillOpacity(BACKGROUND_OPACITY)
    .strokeColor(getColor(tracker.color))
    .strokeOpacity(0.5)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(`${item.id}-${tracker.position}-bubble-bg`)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  const valueText = tracker.value.toString();

  const bubbleText = buildText()
    .position({
      x: position.x - BUBBLE_DIAMETER / 2 - (valueText.length >= 3 ? 0 : 0),
      y: position.y - BUBBLE_DIAMETER / 2 + TEXT_VERTICAL_OFFSET,
    })
    .plainText(valueText.length > 3 ? String.fromCharCode(0x2026) : valueText)
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(
      valueText.length === 3 ? REDUCED_CIRCLE_FONT_SIZE : CIRCLE_FONT_SIZE,
    )
    .fontFamily(FONT)
    .textType("PLAIN")
    .height(CIRCLE_TEXT_HEIGHT)
    .width(BUBBLE_DIAMETER)
    .fontWeight(400)
    //.strokeColor("black")
    //.strokeWidth(0)
    .attachedTo(item.id)
    .layer("TEXT")
    .locked(true)
    .id(`${item.id}-${tracker.position}-bubble-text`)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  return [bubbleShape, bubbleText];
}

export function createImageBubble(
  item: Image,
  bounds: { width: number; height: number },
  position: { x: number; y: number },
  color: string,
  url: string,
  label: string,
): Item[] {
  const bubbleShape = buildShape()
    .width(bounds.width)
    .height(BUBBLE_DIAMETER)
    .shapeType("CIRCLE")
    .fillColor(color)
    .fillOpacity(BACKGROUND_OPACITY)
    .strokeColor(color)
    .strokeOpacity(0.5)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(`${item.id}-${label}-img-bg`)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  const imageObject = {
    width: 50,
    height: 50,
    mime: "image/png",
    url: url,
  };

  const image = buildImage(imageObject, item.grid)
    .position({
      x:
        position.x +
        (150 - bounds.width) / 2 +
        bounds.width / 2 -
        imageObject.width / 4,
      y:
        position.y +
        (150 - bounds.height) / 2 +
        bounds.height / 2 -
        imageObject.height / 4,
    })
    // .position(position)
    .attachedTo(item.id)
    .locked(true)
    .name(`hide icon`)
    .id(`${item.id}-${label}-img`)
    .layer("NOTE")
    .disableHit(DISABLE_HIT)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .build();

  return [bubbleShape, image];
}

// Constants used in createHealthBar()
const BAR_PADDING = 2;
const TRACKER_OPACITY = 0.7;
export const FULL_BAR_HEIGHT = 20;

/** Creates health bar component items */
export function createTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  segments = 0,
): Item[] {
  const position = {
    x: origin.x - bounds.width / 2 + BAR_PADDING,
    y: origin.y - FULL_BAR_HEIGHT,
  };
  const barWidth = bounds.width - BAR_PADDING * 2;
  const barTextHeight = FULL_BAR_HEIGHT + 0;
  const setVisibilityProperty = item.visible;

  if (tracker.variant !== "value-max") throw "Error";

  const trackerBackgroundColor = "dimgrey"; // "#A4A4A4";

  const backgroundShape = buildShape()
    .width(barWidth)
    .height(FULL_BAR_HEIGHT)
    .shapeType("RECTANGLE")
    .fillColor(trackerBackgroundColor)
    .fillOpacity(BACKGROUND_OPACITY)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(`${item.id}-${tracker.position}-bar-bg`)
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  let fillPercentage: number;
  if (tracker.value <= 0) {
    fillPercentage = 0;
  } else if (tracker.value < tracker.max) {
    if (segments === 0) {
      fillPercentage = tracker.value / tracker.max;
    } else {
      fillPercentage =
        Math.ceil((tracker.value / tracker.max) * segments) / segments;
    }
  } else if (tracker.value >= tracker.max) {
    fillPercentage = 1;
  } else {
    fillPercentage = 0;
  }

  const healthShape = buildShape()
    .width(fillPercentage === 0 ? 0 : barWidth * fillPercentage)
    .height(FULL_BAR_HEIGHT)
    .shapeType("RECTANGLE")
    .fillColor(getColor(tracker.color))
    .fillOpacity(TRACKER_OPACITY)
    .strokeWidth(0)
    .strokeOpacity(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(`${item.id}-${tracker.position}-bar-fill`)
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  const healthText = buildText()
    .position({ x: position.x, y: position.y + TEXT_VERTICAL_OFFSET })
    .plainText(`${tracker.value}/${tracker.max}`)
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(FONT_SIZE)
    .fontFamily(FONT)
    .textType("PLAIN")
    .height(barTextHeight)
    .width(barWidth)
    .fontWeight(400)
    //.strokeColor("black")
    //.strokeWidth(0)
    .attachedTo(item.id)
    .fillOpacity(1)
    .layer("TEXT")
    .locked(true)
    .id(`${item.id}-${tracker.position}-bar-text`)
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  return [backgroundShape, healthShape, healthText];
}

export function getBubbleItemIds(itemId: string, position: number) {
  return [
    `${itemId}-${position}-bubble-bg`,
    `${itemId}-${position}-bubble-text`,
  ];
}

export function getImageBubbleItemIds(itemId: string, label: string) {
  return [`${itemId}-${label}-img-bg`, `${itemId}-${label}-img`];
}

export function getBarItemIds(itemId: string, position: number) {
  return [
    `${itemId}-${position}-bar-bg`,
    `${itemId}-${position}-bar-fill`,
    `${itemId}-${position}-bar-text`,
  ];
}

export function getBarTextId(itemId: string, position: number) {
  return `${itemId}-${position}-bar-text`;
}
