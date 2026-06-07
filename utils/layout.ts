export function premiumColumnWidth(screenWidth: number) {
  const compact = screenWidth < 600;
  return Math.min(screenWidth * (compact ? 0.84 : 0.88), compact ? 344 : 384);
}
