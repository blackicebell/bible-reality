export function premiumColumnWidth(screenWidth: number) {
  const compact = screenWidth < 600;
  const tablet = screenWidth >= 600 && screenWidth < 900;
  const horizontalInset = compact ? 18 : tablet ? 48 : 64;
  const maxWidth = compact ? 430 : tablet ? 560 : 640;

  return Math.min(screenWidth - horizontalInset * 2, maxWidth);
}

export function premiumBottomNavWidth(screenWidth: number) {
  const compact = screenWidth < 600;
  const horizontalInset = compact ? 16 : 48;
  const maxWidth = compact ? 390 : 430;

  return Math.min(screenWidth - horizontalInset * 2, maxWidth);
}
