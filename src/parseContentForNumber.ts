export function parseContentForNumber(
  inputContent: string,
  previousValue: number,
  doInlineMath = true,
  bounds?: { min?: number; max?: number },
): number {
  if (inputContent.startsWith("=")) {
    inputContent = inputContent.substring(1).trim();
    doInlineMath = false;
  }

  const newValue = parseFloat(inputContent);

  if (Number.isNaN(newValue)) return 0;
  if (
    doInlineMath &&
    (inputContent.startsWith("+") || inputContent.startsWith("-"))
  ) {
    return Math.trunc(previousValue + Math.trunc(newValue));
  }

  if (bounds !== undefined) {
    if (bounds.max !== undefined && newValue > bounds.max) return bounds.max;
    if (bounds.min !== undefined && newValue < bounds.min) return bounds.min;
  }

  return newValue;
}
