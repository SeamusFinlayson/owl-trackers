import {
  AttachmentBehavior,
  Image,
  Item,
  buildImage,
  buildShape,
  buildText,
} from "@owlbear-rodeo/sdk";
import { getColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";

// Constants used in multiple functions
const FONT = "Roboto, sans-serif";
const DISABLE_HIT = true;
const BUBBLE_OPACITY = 0.7;
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
    .fillOpacity(BUBBLE_OPACITY)
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
      x: position.x - BUBBLE_DIAMETER / 2,
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
  sceneDpi: number,
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
    .fillOpacity(BUBBLE_OPACITY)
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

  const length = 24;
  const imageObject = {
    width: length,
    height: length,
    mime: "image/png",
    url: url,
  };

  const image = buildImage(imageObject, {
    offset: { x: length / 2, y: length / 2 },
    dpi: sceneDpi,
  })
    .position(position)
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
const FILL_OPACITY = 0.8;
export const FULL_BAR_HEIGHT = 20;
export const REDUCED_BAR_HEIGHT = 16;
const BACKGROUND_OPACITY = 0.4;

/** Creates health bar component items */
export function createTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  reducedHeight = false,
  segments = 0,
): Item[] {
  const barHeight = reducedHeight ? REDUCED_BAR_HEIGHT : FULL_BAR_HEIGHT;
  const position = {
    x: origin.x - bounds.width / 2 + BAR_PADDING,
    y: origin.y - barHeight,
  };
  const barWidth = bounds.width - BAR_PADDING * 2;
  const setVisibilityProperty = item.visible;

  if (tracker.variant !== "value-max") throw "Error";

  const trackerBackgroundColor = "black"; // "#A4A4A4";

  const backgroundShape = buildShape()
    .width(barWidth)
    .height(barHeight)
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

  const fillPortion = getFillPortion(tracker.value, tracker.max, segments);

  const healthShape = buildShape()
    .width(fillPortion === 0 ? 0 : barWidth * fillPortion)
    .height(barHeight)
    .shapeType("RECTANGLE")
    .fillColor(getColor(tracker.color))
    .fillOpacity(FILL_OPACITY)
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

  const barTextHeight = reducedHeight
    ? REDUCED_BAR_HEIGHT
    : FULL_BAR_HEIGHT + 0;
  const barFontSize = reducedHeight
    ? REDUCED_BAR_HEIGHT + 2
    : FULL_BAR_HEIGHT + 2;

  const healthText = buildText()
    .position({
      x: position.x,
      y: position.y + TEXT_VERTICAL_OFFSET - (reducedHeight ? 0.3 : 0),
    })
    .plainText(`${tracker.value}/${tracker.max}`)
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(barFontSize)
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

export const MINIMAL_BAR_HEIGHT = 12;

/** Creates health bar component items */
export function createMinimalTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  segments = 0,
): Item[] {
  const barHeight = MINIMAL_BAR_HEIGHT;
  const position = {
    x: origin.x - bounds.width / 2 + BAR_PADDING,
    y: origin.y - barHeight,
  };
  const barWidth = bounds.width - BAR_PADDING * 2;
  const setVisibilityProperty = item.visible;

  if (tracker.variant !== "value-max") throw "Error";

  const trackerBackgroundColor = "black"; // "#A4A4A4";

  const backgroundShape = buildShape()
    .width(barWidth)
    .height(barHeight)
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

  const fillPortion = getFillPortion(tracker.value, tracker.max, segments);

  const healthShape = buildShape()
    .width(fillPortion === 0 ? 0 : barWidth * fillPortion)
    .height(barHeight)
    .shapeType("RECTANGLE")
    .fillColor(getColor(tracker.color))
    .fillOpacity(FILL_OPACITY)
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

  return [backgroundShape, healthShape];
}

function getFillPortion(value: number, maxValue: number, segments = 0) {
  if (value <= 0) return 0;
  if (value >= maxValue) return 1;
  if (segments === 0) return value / maxValue;
  return Math.ceil((value / maxValue) * segments) / segments;
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
