import * as PIXI from 'pixi.js';
import { Thread } from '../types';
import { getScaledPos } from './coords';

const CARD_W = 140;
const CARD_H = 185;

const THREAD_COLOR = 0xCC1111;
const SHADOW_COLOR = 0x220000;

// Calculate the precise world coordinates of the pushpin on a card
function getPinWorldPos(container: PIXI.Container): { x: number; y: number } {
  // Local pin position is (CARD_W / 2, -2)
  // Pivot is (CARD_W / 2, CARD_H / 2)
  // Relative offset from pivot: dx = 0, dy = -2 - CARD_H / 2
  const dy = -2 - CARD_H / 2; // -94.5
  const theta = container.rotation;
  
  // Account for scale multiplier during hover transitions
  const scale = container.scale.y;
  const scaledDy = dy * scale;
  
  return {
    x: container.x - scaledDy * Math.sin(theta),
    y: container.y + scaledDy * Math.cos(theta),
  };
}

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

    // Get exact physical positions of the red pushpins on each card
    const fromPin = getPinWorldPos(fromContainer);
    const toPin = getPinWorldPos(toContainer);

    const fx = fromPin.x;
    const fy = fromPin.y;
    const tx = toPin.x;
    const ty = toPin.y;

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

    // Shadow pass (drawn slightly offset to simulate depth)
    gfx.lineStyle(3.5, SHADOW_COLOR, 0.35, 0.5, true);
    gfx.moveTo(fx + 2, fy + 3);
    gfx.quadraticCurveTo(cpX + 2, cpY + 3, tx + 2, ty + 3);

    // Main red thread
    gfx.lineStyle(2, THREAD_COLOR, 0.88, 0.5, true);
    gfx.moveTo(fx, fy);
    gfx.quadraticCurveTo(cpX, cpY, tx, ty);

    // Small wrapped thread knot at each pushpin center
    gfx.lineStyle(0);
    gfx.beginFill(THREAD_COLOR, 0.9);
    gfx.drawCircle(fx, fy, 2.5);
    gfx.drawCircle(tx, ty, 2.5);
    gfx.endFill();
  }
}

// Decorative PRAGMATICS DIARY letter tiles
export function createCodeLetters(
  stage: PIXI.Container,
  canvasW: number,
  canvasH: number,
): PIXI.Container[] {
  const letters = [
    // Row 1: PRAGMATICS
    { char: 'P', x: 0.311, y: 0.43 },
    { char: 'R', x: 0.353, y: 0.43 },
    { char: 'A', x: 0.395, y: 0.43 },
    { char: 'G', x: 0.437, y: 0.43 },
    { char: 'M', x: 0.479, y: 0.43 },
    { char: 'A', x: 0.521, y: 0.43 },
    { char: 'T', x: 0.563, y: 0.43 },
    { char: 'I', x: 0.605, y: 0.43 },
    { char: 'C', x: 0.647, y: 0.43 },
    { char: 'S', x: 0.689, y: 0.43 },
    // Row 2: DIARY
    { char: 'D', x: 0.408, y: 0.53 },
    { char: 'I', x: 0.454, y: 0.53 },
    { char: 'A', x: 0.500, y: 0.53 },
    { char: 'R', x: 0.546, y: 0.53 },
    { char: 'Y', x: 0.592, y: 0.53 },
  ];

  const containers: PIXI.Container[] = [];

  letters.forEach((item, i) => {
    const c = new PIXI.Container();
    const pos = getScaledPos(item.x, item.y, canvasW, canvasH);
    c.x = pos.x;
    c.y = pos.y;
    c.rotation = (Math.random() - 0.5) * 0.08;

    // Yellow sticky card
    const bg = new PIXI.Graphics();
    bg.beginFill(0xFFD633, 1.0);
    bg.drawRect(-28, -28, 56, 56);
    bg.endFill();
    bg.lineStyle(1.5, 0xCCA800, 0.5);
    bg.drawRect(-28, -28, 56, 56);
    c.addChild(bg);

    // Pin shadow
    const pinShadow = new PIXI.Graphics();
    pinShadow.beginFill(0x000000, 0.2);
    pinShadow.drawCircle(2, 2, 6);
    pinShadow.endFill();
    c.addChild(pinShadow);

    // Pin
    const pin = new PIXI.Graphics();
    pin.beginFill(0xEE1111, 1.0);
    pin.drawCircle(0, 0, 6);
    pin.endFill();
    pin.beginFill(0xFFFFFF, 0.5);
    pin.drawCircle(-2, -2, 2.5);
    pin.endFill();
    c.addChild(pin);

    // Letter
    const style = new PIXI.TextStyle({
      fontFamily: 'Oswald, sans-serif',
      fontSize: 36,
      fontWeight: '700',
      fill: 0xCC3300,
      align: 'center',
    });
    const text = new PIXI.Text(item.char, style);
    text.anchor.set(0.5, 0.5);
    text.y = 12;
    text.roundPixels = true;
    c.addChild(text);

    // Store base for float animation and resizing
    (c as any).__baseX = c.x;
    (c as any).__baseY = c.y;
    (c as any).__xPct = item.x;
    (c as any).__yPct = item.y;
    (c as any).__floatPhase = i * 0.35 + 10;
    (c as any).__floatSpeed = 0.5 + i * 0.03;

    stage.addChild(c);
    containers.push(c);
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
  qText.roundPixels = true;
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
  label.roundPixels = true;
  c.addChild(label);

  (c as any).__baseX = c.x;
  (c as any).__baseY = c.y;
  (c as any).__floatPhase = 7.3;
  (c as any).__floatSpeed = 0.55;

  stage.addChild(c);
  return c;
}
