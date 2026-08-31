import * as PIXI from 'pixi.js';
import { DiaryCase, AnimState } from '../types';
import { getScaledPos, CARD_W, CARD_H } from './coords';
const PIN_R = 7;

// Stamp colours
const STAMP_COLOURS: Record<string, number> = {
  'EVIDENCE LOG': 0x1a3a6e,
  'CONFIDENTIAL': 0x8B0000,
  'SOLVED': 0x145214,
  'OPEN': 0x7a4a00,
};

function wrapText(text: string, maxChars: number): string {
  const words = text.split(' ');
  let lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
    if (lines.length >= 3) break;
  }
  if (lines.length < 3 && line) lines.push(line);
  return lines.join('\n');
}

// Draw a jagged/ripped edge rectangle for newspaper clippings
function drawJaggedRect(g: PIXI.Graphics, x: number, y: number, w: number, h: number, seed: number) {
  g.moveTo(x, y);
  
  // Top edge (mostly straight but slightly uneven)
  g.lineTo(x + w, y);
  
  // Right edge (jagged/ripped)
  let cy = y;
  while (cy < y + h) {
    cy += 6;
    if (cy > y + h) cy = y + h;
    const off = cy === y + h ? 0 : ((Math.sin(cy * 0.4 + seed) + 1) * 2);
    g.lineTo(x + w - off, cy);
  }
  
  // Bottom edge (mostly straight)
  g.lineTo(x, y + h);
  
  // Left edge (jagged/ripped)
  while (cy > y) {
    cy -= 6;
    if (cy < y) cy = y;
    const off = cy === y ? 0 : ((Math.cos(cy * 0.4 + seed) + 1) * 2);
    g.lineTo(x + off, cy);
  }
}

export function createCardSprite(
  diaryCase: DiaryCase,
  canvasW: number,
  canvasH: number,
  onSelect: (c: DiaryCase) => void,
): PIXI.Container {
  const container = new PIXI.Container();

  const pos = getScaledPos(diaryCase.xPct, diaryCase.yPct, canvasW, canvasH);
  const baseX = pos.x;
  const baseY = pos.y;
  container.x = baseX;
  container.y = baseY;
  container.pivot.set(CARD_W / 2, CARD_H / 2);
  container.rotation = diaryCase.baseRotation;

  const cardSeed = diaryCase.caseNumber.charCodeAt(6) || 0;

  // ── Shadow ──────────────────────────────────────────────────────────────────
  const shadow = new PIXI.Graphics();
  shadow.beginFill(0x000000, 0.45);
  if (diaryCase.cardType === 'clipping') {
    drawJaggedRect(shadow, 4, 6, CARD_W, CARD_H, cardSeed);
  } else {
    shadow.drawRect(4, 6, CARD_W, CARD_H);
  }
  shadow.endFill();
  container.addChild(shadow);

  // ── Card body ───────────────────────────────────────────────────────────────
  const body = new PIXI.Graphics();
  const bodyColour =
    diaryCase.cardType === 'note'
      ? 0xFFE57F // Warm sticky note yellow
      : diaryCase.cardType === 'photo'
      ? 0xFCFCFC // Polaroid white backing board
      : diaryCase.cardType === 'clipping'
      ? 0xEDE5D3 // Aged greyish newsprint paper
      : 0xF2EAD8; // Manila document folder backing

  body.beginFill(bodyColour);
  if (diaryCase.cardType === 'clipping') {
    drawJaggedRect(body, 0, 0, CARD_W, CARD_H, cardSeed);
  } else {
    body.drawRect(0, 0, CARD_W, CARD_H);
  }
  body.endFill();

  // Aged board inner margin lines (except for photo polaroids)
  if (diaryCase.cardType !== 'photo') {
    body.lineStyle(1, 0xBBAA7A, 0.3);
    if (diaryCase.cardType === 'clipping') {
      drawJaggedRect(body, 3, 3, CARD_W - 6, CARD_H - 6, cardSeed);
    } else {
      body.drawRect(3, 3, CARD_W - 6, CARD_H - 6);
    }
  }
  container.addChild(body);

  // ── Accent top bar (Only for document/note/clipping types, Polaroid has none) ──
  if (diaryCase.cardType !== 'photo') {
    const accent = new PIXI.Graphics();
    accent.beginFill(diaryCase.accentHex, 0.85);
    // Draw inside clipping/non-clipping bounds
    if (diaryCase.cardType === 'clipping') {
      accent.drawRect(2, 2, CARD_W - 4, 24);
    } else {
      accent.drawRect(0, 0, CARD_W, 26);
    }
    accent.endFill();
    container.addChild(accent);
  }

  // ── Tape strip (Randomly mired organic placement) ───────────────────────────
  const tape = new PIXI.Graphics();
  tape.beginFill(0xEAE2CE, 0.42); // translucent masking tape
  tape.drawRect(-22, -4, 44, 11);
  tape.endFill();
  tape.x = CARD_W / 2;
  tape.y = 0;
  tape.rotation = ((cardSeed % 9) - 4) * 0.035; // organic slight rotation
  container.addChild(tape);

  // ── Case number & Category Texts ─────────────────────────────────────────────
  if (diaryCase.cardType !== 'photo') {
    const caseNumStyle = new PIXI.TextStyle({
      fontFamily: 'Oswald, sans-serif',
      fontSize: 10,
      fontWeight: '700',
      fill: 0xFFFFFF,
      letterSpacing: 1.5,
    });
    const caseNum = new PIXI.Text(diaryCase.caseNumber, caseNumStyle);
    caseNum.x = 8;
    caseNum.y = 6;
    container.addChild(caseNum);

    const catStyle = new PIXI.TextStyle({
      fontFamily: 'Oswald, sans-serif',
      fontSize: 7.5,
      fontWeight: '400',
      fill: 0xEAD8BB,
      letterSpacing: 0.8,
    });
    const cat = new PIXI.Text(diaryCase.category, catStyle);
    cat.x = CARD_W - cat.width - 8;
    cat.y = 7;
    container.addChild(cat);
  }

  // ── Visual Graphic / Photo print area (POLAROID specific vs other types) ─────
  const iconY = diaryCase.cardType === 'photo' ? 10 : 32;
  const iconH = diaryCase.cardType === 'photo' ? 95 : 55;
  const imgGfx = new PIXI.Graphics();

  if (diaryCase.cardType === 'photo') {
    // Polaroid photo slot: black/grey grayscale print frame
    imgGfx.beginFill(0x222222, 0.95);
    imgGfx.drawRect(8, iconY, CARD_W - 16, iconH);
    imgGfx.endFill();

    // Photo details (Silhouette drawing)
    imgGfx.lineStyle(1.5, 0x4a4a4a, 0.8);
    const cx = CARD_W / 2;
    imgGfx.drawCircle(cx, iconY + 30, 11);
    imgGfx.moveTo(cx - 18, iconY + iconH - 5);
    imgGfx.quadraticCurveTo(cx, iconY + 54, cx + 18, iconY + iconH - 5);

    // Subtle gloss highlights on polaroid surface
    imgGfx.lineStyle(1.5, 0xFFFFFF, 0.08);
    imgGfx.moveTo(12, iconY + 8);
    imgGfx.lineTo(CARD_W - 12, iconY + iconH - 8);
  } else if (diaryCase.cardType === 'clipping') {
    // Ruled columns representing newspaper article body
    imgGfx.lineStyle(1, 0x5a554a, 0.45);
    for (let i = 0; i < 4; i++) {
      imgGfx.moveTo(8, iconY + 8 + i * 10);
      imgGfx.lineTo(CARD_W - 8, iconY + 8 + i * 10);
    }
  } else if (diaryCase.cardType === 'note') {
    // Notepad lined pattern
    imgGfx.lineStyle(1, 0x8A7E00, 0.28);
    for (let i = 0; i < 4; i++) {
      imgGfx.moveTo(8, iconY + 8 + i * 12);
      imgGfx.lineTo(CARD_W - 8, iconY + 8 + i * 12);
    }
  } else {
    // Ruled paper margin
    imgGfx.lineStyle(1.2, 0xBBAA88, 0.45);
    imgGfx.moveTo(10, iconY + 4);
    imgGfx.lineTo(10, iconY + iconH - 4);
    for (let i = 0; i < 4; i++) {
      imgGfx.moveTo(14, iconY + 8 + i * 11);
      imgGfx.lineTo(CARD_W - 8, iconY + 8 + i * 11);
    }
  }
  container.addChild(imgGfx);

  // ── Title & Content texts ───────────────────────────────────────────────────
  const textYStart = iconY + iconH + 6;

  if (diaryCase.cardType === 'photo') {
    // Polaroid title text written underneath the photograph frame
    const photoTitleStyle = new PIXI.TextStyle({
      fontFamily: 'Special Elite, serif',
      fontSize: 10,
      fill: 0x1c1a16,
      wordWrap: true,
      wordWrapWidth: CARD_W - 14,
      align: 'center',
    });
    const photoTitle = new PIXI.Text(diaryCase.title, photoTitleStyle);
    photoTitle.anchor.set(0.5, 0);
    photoTitle.x = CARD_W / 2;
    photoTitle.y = textYStart + 2;
    container.addChild(photoTitle);

    // Polaroid date written below the title like real handwriting
    const handwrittenDateStyle = new PIXI.TextStyle({
      fontFamily: 'Courier Prime, monospace',
      fontSize: 8,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: 0x7A2A1A,
      letterSpacing: 0.5,
    });
    const handDateText = new PIXI.Text(diaryCase.date, handwrittenDateStyle);
    handDateText.anchor.set(0.5, 0);
    handDateText.x = CARD_W / 2;
    handDateText.y = textYStart + photoTitle.height + 4;
    container.addChild(handDateText);
  } else {
    // Normal case cards (Note, Clipping, Document)
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Special Elite, serif',
      fontSize: 9.5,
      fill: 0x1A1210,
      wordWrap: true,
      wordWrapWidth: CARD_W - 12,
    });
    const titleText = new PIXI.Text(diaryCase.title, titleStyle);
    titleText.x = 7;
    titleText.y = textYStart;
    container.addChild(titleText);

    // Divider line
    const divider = new PIXI.Graphics();
    divider.lineStyle(1, 0xBBAA7A, 0.45);
    const divY = textYStart + titleText.height + 4;
    divider.moveTo(7, divY);
    divider.lineTo(CARD_W - 7, divY);
    container.addChild(divider);

    // Excerpt text
    const excerptStyle = new PIXI.TextStyle({
      fontFamily: 'Courier Prime, monospace',
      fontSize: 8,
      fill: 0x3A3028,
      wordWrap: true,
      wordWrapWidth: CARD_W - 12,
      leading: 0.5,
    });
    const wrapped = wrapText(diaryCase.excerpt, 26);
    const excerptText = new PIXI.Text(wrapped, excerptStyle);
    excerptText.x = 7;
    excerptText.y = divY + 4;
    container.addChild(excerptText);
  }

  // ── Stamp overlay (Slightly smaller stamp) ───────────────────────────────────
  const stampContainer = new PIXI.Container();
  stampContainer.x = CARD_W / 2;
  stampContainer.y = CARD_H - 26;

  const stampBg = new PIXI.Graphics();
  const stampColour = STAMP_COLOURS[diaryCase.stampType] ?? 0x8B0000;
  stampBg.lineStyle(2, stampColour, 0.7);
  stampBg.drawRoundedRect(-36, -10, 72, 20, 3);
  stampContainer.addChild(stampBg);

  const stampStyle = new PIXI.TextStyle({
    fontFamily: 'Oswald, sans-serif',
    fontSize: 9,
    fontWeight: '700',
    fill: stampColour,
    letterSpacing: 1.5,
    align: 'center',
  });
  const stampText = new PIXI.Text(diaryCase.stampType, stampStyle);
  stampText.anchor.set(0.5, 0.5);
  stampContainer.addChild(stampText);
  stampContainer.rotation = -0.18;
  stampContainer.alpha = 0.72;
  container.addChild(stampContainer);

  // ── Red Pin with 3D shadow & metallic pin needles ────────────────────────────
  const pinContainer = new PIXI.Container();
  pinContainer.x = CARD_W / 2;
  pinContainer.y = -2;

  // Pin Shadow
  const pinShadow = new PIXI.Graphics();
  pinShadow.beginFill(0x000000, 0.32);
  pinShadow.drawCircle(1.5, 2.5, PIN_R - 0.5);
  pinShadow.endFill();
  pinContainer.addChild(pinShadow);

  // Metallic needle lines sticking into board
  const pinNeedle = new PIXI.Graphics();
  pinNeedle.lineStyle(1.2, 0x888888, 0.65);
  pinNeedle.moveTo(0, 0);
  pinNeedle.lineTo(1.5, 4.5);
  pinContainer.addChild(pinNeedle);

  // Pin Head dome
  const pinHead = new PIXI.Graphics();
  pinHead.beginFill(0xCC1111, 1.0);
  pinHead.drawCircle(0, 0, PIN_R);
  pinHead.endFill();
  // Highlight gloss
  pinHead.beginFill(0xFFFFFF, 0.55);
  pinHead.drawCircle(-1.8, -1.8, 1.8);
  pinHead.endFill();
  pinContainer.addChild(pinHead);

  container.addChild(pinContainer);

  // ── Interactivity ─────────────────────────────────────────────────────────────
  container.interactive = true;
  container.cursor = 'pointer';

  container.on('pointerover', () => {
    const s = (container as any).__animState as AnimState;
    if (s) { s.targetScale = 1.07; s.isHovered = true; }
  });
  container.on('pointerout', () => {
    const s = (container as any).__animState as AnimState;
    if (s) { s.targetScale = 1.0; s.isHovered = false; }
  });
  container.on('pointerdown', () => {
    onSelect(diaryCase);
  });

  // ── Attach animation state ────────────────────────────────────────────────────
  const animState: AnimState = {
    baseX,
    baseY,
    baseRotation: diaryCase.baseRotation,
    floatSpeed: diaryCase.floatSpeed,
    floatPhase: diaryCase.floatPhase,
    currentScale: 1.0,
    targetScale: 1.0,
    pinPulse: 0,
    isHovered: false,
    caseData: diaryCase,
  };
  (container as any).__animState = animState;
  (container as any).__pin = pinContainer; // targets the entire pin container for pulse animation

  return container;
}

export { CARD_W, CARD_H };
