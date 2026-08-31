export const CARD_W = 140;
export const CARD_H = 185;

const PADDING_X = CARD_W / 2 + 55; // ~125px safe margin
const PADDING_Y = CARD_H / 2 + 65; // ~157.5px safe margin

export function getScaledPos(
  xPct: number,
  yPct: number,
  canvasW: number,
  canvasH: number,
) {
  const safeW = canvasW - PADDING_X * 2;
  const safeH = canvasH - PADDING_Y * 2;
  return {
    x: PADDING_X + xPct * safeW,
    y: PADDING_Y + yPct * safeH,
  };
}
