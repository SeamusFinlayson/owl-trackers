import {
  AttachmentBehavior,
  Image,
  Item,
  buildCurve,
  buildImage,
  buildShape,
  buildText,
} from "@owlbear-rodeo/sdk";
import { getColor } from "../colorHelpers";
import { Tracker } from "../trackerHelpersBasic";
import { createRoundedRectangle, getFillPortion } from "./mathHelpers";

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
const TEXT_VERTICAL_OFFSET = -1.2;

// Constants used in createStatBubble()
export const BUBBLE_DIAMETER = 30;
const CIRCLE_FONT_SIZE = BUBBLE_DIAMETER - 8;
const REDUCED_CIRCLE_FONT_SIZE = BUBBLE_DIAMETER - 15;
const CIRCLE_TEXT_HEIGHT = BUBBLE_DIAMETER + 2;

/** Creates Stat Bubble component items */
export function createTrackerBubble(
  item: Item,
  tracker: Tracker,
  position: { x: number; y: number },
  index: number,
): Item[] {
  if (tracker.variant !== "value" && tracker.variant !== "counter")
    throw new Error("Expected value tracker variant");

  const bubbleShape = buildShape()
    .width(BUBBLE_DIAMETER)
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
    .id(getBubbleBackgroundId(item.id, index))
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
    .id(getBubbleTextId(item.id, index))
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  return [bubbleShape, bubbleText];
}

export function createImageBubble(
  item: Image,
  sceneDpi: number,
  position: { x: number; y: number },
  color: string,
  url: string,
  label: string,
): Item[] {
  const bubbleShape = buildShape()
    .width(BUBBLE_DIAMETER)
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
    .id(getImageBackgroundId(item.id, label))
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  const desiredLength = 24;
  const IMAGE_DPI = 150; // Specific to visibility off icon used in extension, square so height and width are equal
  const imageObject = {
    width: IMAGE_DPI,
    height: IMAGE_DPI,
    mime: "image/png",
    url: url,
  };
  const imageInSceneDpi = (sceneDpi * IMAGE_DPI) / desiredLength;

  const image = buildImage(imageObject, {
    offset: { x: sceneDpi / 2, y: sceneDpi / 2 },
    dpi: imageInSceneDpi,
  })
    .position(position)
    .attachedTo(item.id)
    .locked(true)
    .name(`hide icon`)
    .id(getImageId(item.id, label))
    .layer("NOTE")
    .disableHit(DISABLE_HIT)
    .visible(item.visible)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .build();

  return [bubbleShape, image];
}

// Constants used in createBarTacker()
const BAR_PADDING = 2;
const FILL_OPACITY = 0.8;
export const FULL_BAR_HEIGHT = 20;
export const REDUCED_BAR_HEIGHT = 16;
const BACKGROUND_OPACITY = 0.7;
const BAR_CORNER_RADIUS = FULL_BAR_HEIGHT / 2;

/** Creates bar component items */
export function createTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  index: number,
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

  const backgroundShape = buildCurve()
    .fillColor(trackerBackgroundColor)
    .fillOpacity(BACKGROUND_OPACITY)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarBackgroundId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(createRoundedRectangle(barWidth, barHeight, BAR_CORNER_RADIUS))
    .build();

  const fillPortion = getFillPortion(tracker.value, tracker.max, segments);

  const fillShape = buildCurve()
    .fillColor(getColor(tracker.color))
    .fillOpacity(FILL_OPACITY)
    .strokeWidth(0)
    .strokeOpacity(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarFillId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(
      createRoundedRectangle(
        barWidth,
        barHeight,
        BAR_CORNER_RADIUS,
        fillPortion,
      ),
    )
    .build();

  const barTextHeight = reducedHeight
    ? REDUCED_BAR_HEIGHT + 8
    : FULL_BAR_HEIGHT + 8;
  const barFontSize = reducedHeight
    ? REDUCED_BAR_HEIGHT + 2
    : FULL_BAR_HEIGHT + 2;

  const barText = buildText()
    .position({
      x: position.x,
      y: position.y + TEXT_VERTICAL_OFFSET + -5.3 - (reducedHeight ? -0.8 : 0),
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
    .id(getBarTextId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .build();

  return [backgroundShape, fillShape, barText];
}

export const MINIMAL_BAR_HEIGHT = 12;

/** Creates bar component items */
export function createMinimalTrackerBar(
  item: Item,
  bounds: { width: number; height: number },
  tracker: Tracker,
  origin: { x: number; y: number },
  segments = 0,
  index: number,
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

  const backgroundShape = buildCurve()
    .fillColor(trackerBackgroundColor)
    .fillOpacity(BACKGROUND_OPACITY)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarBackgroundId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(createRoundedRectangle(barWidth, barHeight, BAR_CORNER_RADIUS))
    .build();

  const fillPortion = getFillPortion(tracker.value, tracker.max, segments);

  const fillShape = buildCurve()
    .fillColor(getColor(tracker.color))
    .fillOpacity(FILL_OPACITY)
    .strokeWidth(0)
    .strokeOpacity(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(getBarFillId(item.id, index))
    .visible(setVisibilityProperty)
    .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
    .disableHit(DISABLE_HIT)
    .tension(0)
    .closed(true)
    .points(
      createRoundedRectangle(
        barWidth,
        barHeight,
        BAR_CORNER_RADIUS,
        fillPortion,
      ),
    )
    .build();

  return [backgroundShape, fillShape];
}

export const getBubbleBackgroundId = (itemId: string, position: number) =>
  `${itemId}-${position}-bubble-bg`;
export const getBubbleTextId = (itemId: string, position: number) =>
  `${itemId}-${position}-bubble-text`;

export const getImageBackgroundId = (itemId: string, label: string) =>
  `${itemId}-${label}-img-bg`;
export const getImageId = (itemId: string, label: string) =>
  `${itemId}-${label}-img`;

export const getBarBackgroundId = (itemId: string, position: number) =>
  `${itemId}-${position}-bar-bg`;
export const getBarFillId = (itemId: string, position: number) =>
  `${itemId}-${position}-bar-fill`;
export const getBarTextId = (itemId: string, position: number) =>
  `${itemId}-${position}-bar-text`;

export function getBubbleItemIds(itemId: string, position: number) {
  return [
    getBubbleBackgroundId(itemId, position),
    getBubbleTextId(itemId, position),
  ];
}

export function getImageBubbleItemIds(itemId: string, label: string) {
  return [getImageBackgroundId(itemId, label), getImageId(itemId, label)];
}

export function getBarItemIds(itemId: string, position: number) {
  return [
    getBarBackgroundId(itemId, position),
    getBarFillId(itemId, position),
    getBarTextId(itemId, position),
  ];
}
