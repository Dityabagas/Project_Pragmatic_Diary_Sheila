import * as PIXI from 'pixi.js';
import { Thread } from '../types';
import { AnimState } from '../types';
import { CARD_W, CARD_H } from './createCardSprite';
import { getScaledPos } from './coords';

const THREAD_COLOR = 0xCC1111;
const SHADOW_COLOR = 0x220000;
const PIN_OFFSET_Y = 0; // threads from top-center (pin position)

export function drawThreads(
  gfx: PIXI.Graphics,
  threads: Thread[],
  cardMap: Map<string, PIXI.Container>,
): void {
  gfx.clear();

  for (const thread of threads) {
    const fromContainer = cardMap.get(thread.fromId);
    const toContainer = cardMap.get(thread.toId);
    if (!fromContainer || !toContainer) continue;

    // Get current world positions of pin (top-center of each card)
    const fx = fromContainer.x;
    const fy = fromContainer.y + PIN_OFFSET_Y;
    const tx = toContainer.x;
    const ty = toContainer.y + PIN_OFFSET_Y;

    // Control point for quadratic curve — sag downward proportional to distance
    const midX = (fx + tx) / 2;
    const midY = (fy + ty) / 2;
    const dist = Math.sqrt((tx - fx) ** 2 + (ty - fy) ** 2);
    const sagAmount = dist * 0.12 + 20;

    // Perpendicular offset direction (slightly randomised per thread pair)
    const seed = (thread.fromId.charCodeAt(thread.fromId.length - 1) +
                  thread.toId.charCodeAt(thread.toId.length - 1)) % 7;
    const perp = seed % 2 === 0 ? 1 : -1;
    const cpX = midX + perp * sagAmount * 0.3;
    const cpY = midY + sagAmount;

    // Shadow pass
    gfx.lineStyle(3.5, SHADOW_COLOR, 0.35, 0.5, true);
    gfx.moveTo(fx + 2, fy + 3);
    gfx.quadraticCurveTo(cpX + 2, cpY + 3, tx + 2, ty + 3);

    // Main thread
    gfx.lineStyle(2, THREAD_COLOR, 0.88, 0.5, true);
    gfx.moveTo(fx, fy);
    gfx.quadraticCurveTo(cpX, cpY, tx, ty);

    // Small pin knot at each endpoint
    gfx.lineStyle(0);
    gfx.beginFill(THREAD_COLOR, 0.9);
    gfx.drawCircle(fx, fy, 3);
    gfx.drawCircle(tx, ty, 3);
    gfx.endFill();
  }
}

const LINE1 = ['P', 'R', 'A', 'G', 'M', 'A', 'T', 'I', 'C', 'S'];
const LINE2 = ['D', 'I', 'A', 'R', 'Y'];

// Tile size
const TILE = 46;
const GAP = 6;

function buildTile(
  letter: string,
  stage: PIXI.Container,
  cx: number,
  cy: number,
  idx: number,
): PIXI.Container {
  const c = new PIXI.Container();
  c.x = cx;
  c.y = cy;
  c.rotation = (Math.random() - 0.5) * 0.09;

  // Yellow sticky card body
  const bg = new PIXI.Graphics();
  bg.beginFill(0xFFD633, 1.0);
  bg.drawRect(-TILE / 2, -TILE / 2, TILE, TILE);
  bg.endFill();
  // inner border highlight
  bg.lineStyle(1.5, 0xCCA800, 0.5);
  bg.drawRect(-TILE / 2 + 2, -TILE / 2 + 2, TILE - 4, TILE - 4);
  c.addChild(bg);

  // Pin shadow
  const pinShadow = new PIXI.Graphics();
  pinShadow.beginFill(0x000000, 0.2);
  pinShadow.drawCircle(2, -TILE / 2 + 2, 6);
  pinShadow.endFill();
  c.addChild(pinShadow);

  // Red pin
  const pin = new PIXI.Graphics();
  pin.beginFill(0xEE1111, 1.0);
  pin.drawCircle(0, -TILE / 2 + 2, 6);
  pin.endFill();
  pin.beginFill(0xFFFFFF, 0.5);
  pin.drawCircle(-2, -TILE / 2, 2.5);
  pin.endFill();
  c.addChild(pin);

  // Letter text
  const style = new PIXI.TextStyle({
    fontFamily: 'Oswald, sans-serif',
    fontSize: 28,
    fontWeight: '700',
    fill: 0xCC3300,
    align: 'center',
  });
  const text = new PIXI.Text(letter, style);
  text.anchor.set(0.5, 0.5);
  text.y = 5;
  c.addChild(text);

  // Store base for float animation
  (c as any).__baseX = cx;
  (c as any).__baseY = cy;
  (c as any).__floatPhase = idx * 0.85 + 10;
  (c as any).__floatSpeed = 0.55 + idx * 0.06;

  stage.addChild(c);
  return c;
}

export function createCodeLetters(
  stage: PIXI.Container,
  canvasW: number,
  canvasH: number,
): PIXI.Container[] {
  const containers: PIXI.Container[] = [];

  const totalLine1W = LINE1.length * TILE + (LINE1.length - 1) * GAP;
  const totalLine2W = LINE2.length * TILE + (LINE2.length - 1) * GAP;

  const centerX = canvasW / 2;
  const centerY = canvasH / 2;

  // Line 1 — "PRAGMATICS" centred
  LINE1.forEach((letter, i) => {
    const cx = centerX - totalLine1W / 2 + i * (TILE + GAP) + TILE / 2;
    const cy = centerY - (TILE + GAP) / 2 - 4;
    containers.push(buildTile(letter, stage, cx, cy, i));
  });

  // Line 2 — "DIARY" centred
  LINE2.forEach((letter, i) => {
    const cx = centerX - totalLine2W / 2 + i * (TILE + GAP) + TILE / 2;
    const cy = centerY + (TILE + GAP) / 2 + 4;
    containers.push(buildTile(letter, stage, cx, cy, LINE1.length + i));
  });

  return containers;
}

// Decorative question mark element
export function createQuestionMark(
  stage: PIXI.Container,
  canvasW: number,
  canvasH: number,
): PIXI.Container {
  const c = new PIXI.Container();
  const pos = getScaledPos(0.21, 0.52, canvasW, canvasH);
  c.x = pos.x;
  c.y = pos.y;
  c.rotation = 0.05;

  const bg = new PIXI.Graphics();
  bg.beginFill(0xF5F0E8, 0.95);
  bg.drawRoundedRect(-30, -40, 60, 80, 4);
  bg.endFill();
  c.addChild(bg);

  const style = new PIXI.TextStyle({
    fontFamily: 'Special Elite, serif',
    fontSize: 52,
    fill: 0x1A1A1A,
    align: 'center',
  });
  const qText = new PIXI.Text('?', style);
  qText.anchor.set(0.5, 0.5);
  qText.y = 5;
  c.addChild(qText);

  const labelStyle = new PIXI.TextStyle({
    fontFamily: 'Courier Prime, monospace',
    fontSize: 8,
    fill: 0x555555,
    letterSpacing: 1,
    align: 'center',
  });
  const label = new PIXI.Text('UNKNOWN\nSUBJECT', labelStyle);
  label.anchor.set(0.5, 0.5);
  label.y = 38;
  c.addChild(label);

  (c as any).__baseX = c.x;
  (c as any).__baseY = c.y;
  (c as any).__floatPhase = 7.3;
  (c as any).__floatSpeed = 0.55;

  stage.addChild(c);
  return c;
}
