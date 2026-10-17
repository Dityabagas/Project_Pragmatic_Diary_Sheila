export const CARD_W = 168;
export const CARD_H = 224;

/**
 * Scale-aware safe coordinate calculator.
 * Ensures consistent safe margins across all laptop screen sizes
 * (MacBook 13", ASUS, Lenovo, Dell, HP, etc.) so cards never overlap
 * with the center "PRAGMATICS DIARY" letter tiles or screen edges.
 */
export function getScaledPos(
  xPct: number,
  yPct: number,
  canvasW: number,
  canvasH: number,
  scale: number = 1.0,
) {
  const padX = (CARD_W * scale) / 2 + Math.max(20, canvasW * 0.025);
  const padY = (CARD_H * scale) / 2 + Math.max(16, canvasH * 0.022);

  const safeW = Math.max(10, canvasW - padX * 2);
  const safeH = Math.max(10, canvasH - padY * 2);

  return {
    x: padX + xPct * safeW,
    y: padY + yPct * safeH,
  };
}
