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
  shadow.beginFill(0x000000, 0.42);
  if (diaryCase.cardType === 'clipping') {
    drawJaggedRect(shadow, 4, 6, CARD_W, CARD_H, cardSeed);
  } else {
    shadow.drawRoundedRect(4, 6, CARD_W, CARD_H, 4);
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
    body.drawRoundedRect(0, 0, CARD_W, CARD_H, 4);
  }
  body.endFill();

  // Aged board inner margin lines (except for photo polaroids)
  if (diaryCase.cardType !== 'photo') {
    body.lineStyle(1, 0xBBAA7A, 0.35);
    if (diaryCase.cardType === 'clipping') {
      drawJaggedRect(body, 3, 3, CARD_W - 6, CARD_H - 6, cardSeed);
    } else {
      body.drawRoundedRect(3, 3, CARD_W - 6, CARD_H - 6, 3);
    }
  }
  container.addChild(body);

  // ── Accent top bar (Only for document/note/clipping types, Polaroid has none) ──
  if (diaryCase.cardType !== 'photo') {
    const accent = new PIXI.Graphics();
    accent.beginFill(diaryCase.accentHex, 0.85);
    if (diaryCase.cardType === 'clipping') {
      accent.drawRect(2, 2, CARD_W - 4, 24);
    } else {
      // Draw with slightly rounded top corners for document/note
      accent.drawRoundedRect(2, 2, CARD_W - 4, 24, 2);
    }
    accent.endFill();
    container.addChild(accent);
  }

  // ── Tape strip (Translucent frosted tape at the top center) ─────────────────
  const tape = new PIXI.Graphics();
  tape.beginFill(0xEAE2CE, 0.42); // translucent masking tape
  tape.drawRect(-22, -4, 44, 11);
  tape.endFill();
  // Tape side tears
  tape.lineStyle(0.5, 0xD2C8B0, 0.3);
  tape.drawRect(-22, -4, 44, 11);
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
    caseNum.roundPixels = true;
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
    cat.roundPixels = true;
    container.addChild(cat);
  }

  // ── Visual Graphic / Photo print area ───────────────────────────────────────
  const iconY = diaryCase.cardType === 'photo' ? 10 : 32;
  const iconH = diaryCase.cardType === 'photo' ? 95 : 55;
  const imgGfx = new PIXI.Graphics();

  if (diaryCase.cardType === 'photo') {
    // Polaroid photo slot: deep surveillance camera print frame
    imgGfx.beginFill(0x1B1B19, 1.0);
    imgGfx.drawRect(8, iconY, CARD_W - 16, iconH);
    imgGfx.endFill();

    // Draw surveillance theme inside photo frame
    // Outer lens
    imgGfx.lineStyle(1.5, 0x333333, 0.8);
    imgGfx.beginFill(0x242422, 1.0);
    imgGfx.drawCircle(CARD_W / 2, iconY + 48, 22);
    imgGfx.endFill();

    // Inner lens glass
    imgGfx.lineStyle(1, 0x444444, 0.9);
    imgGfx.beginFill(0x121210, 1.0);
    imgGfx.drawCircle(CARD_W / 2, iconY + 48, 12);
    imgGfx.endFill();

    // Lens reflection gloss
    imgGfx.lineStyle(0);
    imgGfx.beginFill(0x66FFFF, 0.15);
    imgGfx.drawCircle(CARD_W / 2 - 4, iconY + 44, 4);
    imgGfx.endFill();

    // Target crosshair lines (surveillance camera HUD)
    imgGfx.lineStyle(0.8, 0xCC1111, 0.4);
    // Center horizontal marks
    imgGfx.moveTo(CARD_W / 2 - 18, iconY + 48);
    imgGfx.lineTo(CARD_W / 2 - 14, iconY + 48);
    imgGfx.moveTo(CARD_W / 2 + 14, iconY + 48);
    imgGfx.lineTo(CARD_W / 2 + 18, iconY + 48);
    // Center vertical marks
    imgGfx.moveTo(CARD_W / 2, iconY + 30);
    imgGfx.lineTo(CARD_W / 2, iconY + 34);
    imgGfx.moveTo(CARD_W / 2, iconY + 62);
    imgGfx.lineTo(CARD_W / 2, iconY + 66);

    // Frame corner bounds
    const cd = 6;
    imgGfx.lineStyle(1, 0x777777, 0.5);
    // Top-Left corner
    imgGfx.moveTo(14, iconY + 6 + cd);
    imgGfx.lineTo(14, iconY + 6);
    imgGfx.lineTo(14 + cd, iconY + 6);
    // Top-Right corner
    imgGfx.moveTo(CARD_W - 14 - cd, iconY + 6);
    imgGfx.lineTo(CARD_W - 14, iconY + 6);
    imgGfx.lineTo(CARD_W - 14, iconY + 6 + cd);
    // Bottom-Left corner
    imgGfx.moveTo(14, iconY + iconH - 6 - cd);
    imgGfx.lineTo(14, iconY + iconH - 6);
    imgGfx.lineTo(14 + cd, iconY + iconH - 6);
    // Bottom-Right corner
    imgGfx.moveTo(CARD_W - 14 - cd, iconY + iconH - 6);
    imgGfx.lineTo(CARD_W - 14, iconY + iconH - 6);
    imgGfx.lineTo(CARD_W - 14, iconY + iconH - 6 - cd);

    // REC Indicator Dot
    imgGfx.lineStyle(0);
    imgGfx.beginFill(0xFF1111, 0.85);
    imgGfx.drawCircle(18, iconY + 16, 2.5);
    imgGfx.endFill();

    // REC Text
    const recStyle = new PIXI.TextStyle({
      fontFamily: 'Courier Prime, monospace',
      fontSize: 6.5,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
    });
    const recText = new PIXI.Text('REC', recStyle);
    recText.x = 24;
    recText.y = iconY + 13;
    recText.roundPixels = true;
    container.addChild(recText);

    // CAM Identifier text in top-right corner
    const camStyle = new PIXI.TextStyle({
      fontFamily: 'Courier Prime, monospace',
      fontSize: 6.5,
      fill: 0x888888,
    });
    const camText = new PIXI.Text('CAM-0' + (cardSeed % 9 + 1), camStyle);
    camText.x = CARD_W - camText.width - 16;
    camText.y = iconY + 13;
    camText.roundPixels = true;
    container.addChild(camText);

    // Gloss overlay reflection streak across the photo print
    imgGfx.lineStyle(1.5, 0xFFFFFF, 0.05);
    imgGfx.moveTo(8, iconY + 20);
    imgGfx.lineTo(CARD_W - 8, iconY + 75);
  } else if (diaryCase.cardType === 'clipping') {
    // Newspaper clipping: dual-column article layout
    // Left picture frame
    imgGfx.beginFill(0x3E372E, 0.7);
    imgGfx.drawRect(8, iconY + 5, 38, 45);
    imgGfx.endFill();

    // Draw tiny mountain contour inside picture frame
    imgGfx.lineStyle(1, 0x6A5C4E, 0.6);
    imgGfx.moveTo(8, iconY + 40);
    imgGfx.lineTo(20, iconY + 25);
    imgGfx.lineTo(34, iconY + 38);
    imgGfx.lineTo(46, iconY + 32);

    // Right-column simulated text lines next to picture
    imgGfx.lineStyle(0.8, 0x4A3C31, 0.45);
    const lineX = 52;
    for (let i = 0; i < 4; i++) {
      const len = i === 3 ? 15 : CARD_W - lineX - 8;
      imgGfx.moveTo(lineX, iconY + 10 + i * 11);
      imgGfx.lineTo(lineX + len, iconY + 10 + i * 11);
    }

    // Divider line below columns
    imgGfx.lineStyle(0.5, 0x4A3C31, 0.35);
    imgGfx.moveTo(8, iconY + 54);
    imgGfx.lineTo(CARD_W - 8, iconY + 54);
  } else if (diaryCase.cardType === 'note') {
    // Notepad: Lined yellow paper with vertical margin line
    imgGfx.lineStyle(1, 0xD85A5A, 0.4); // red margin line
    imgGfx.moveTo(16, iconY);
    imgGfx.lineTo(16, iconY + iconH);

    // Blue horizontal ruled lines
    imgGfx.lineStyle(0.8, 0x4E7ECF, 0.25);
    for (let i = 0; i < 4; i++) {
      imgGfx.moveTo(18, iconY + 8 + i * 12);
      imgGfx.lineTo(CARD_W - 8, iconY + 8 + i * 12);
    }
  } else {
    // Document: Official files with simulated barcode and neat typed lines
    // Barcode stripes in top-right
    imgGfx.lineStyle(0);
    imgGfx.beginFill(0x3A3028, 0.65);
    const barcodeX = CARD_W - 32;
    const barcodeY = iconY + 4;
    imgGfx.drawRect(barcodeX, barcodeY, 2, 8);
    imgGfx.drawRect(barcodeX + 3, barcodeY, 1, 8);
    imgGfx.drawRect(barcodeX + 5, barcodeY, 3, 8);
    imgGfx.drawRect(barcodeX + 9, barcodeY, 1, 8);
    imgGfx.drawRect(barcodeX + 11, barcodeY, 2, 8);
    imgGfx.drawRect(barcodeX + 14, barcodeY, 4, 8);
    imgGfx.drawRect(barcodeX + 19, barcodeY, 1, 8);
    imgGfx.endFill();

    // Tiny stamp in top left
    imgGfx.lineStyle(0.8, 0xCC1111, 0.4);
    imgGfx.drawRoundedRect(8, iconY + 2, 34, 10, 1);
    const officialStyle = new PIXI.TextStyle({
      fontFamily: 'Oswald, sans-serif',
      fontSize: 5.5,
      fontWeight: 'bold',
      fill: 0xCC1111,
      letterSpacing: 0.5,
    });
    const officialText = new PIXI.Text('OFFICIAL', officialStyle);
    officialText.x = 11;
    officialText.y = iconY + 3;
    officialText.alpha = 0.5;
    officialText.roundPixels = true;
    container.addChild(officialText);

    // Lined text blocks with paragraph variation
    imgGfx.lineStyle(1.2, 0x4A3C31, 0.35);
    for (let i = 0; i < 4; i++) {
      const lineLen = i === 1 ? CARD_W - 40 : i === 3 ? CARD_W - 60 : CARD_W - 16;
      imgGfx.moveTo(8, iconY + 18 + i * 11);
      imgGfx.lineTo(8 + lineLen, iconY + 18 + i * 11);
    }
  }
  container.addChild(imgGfx);

  // ── Title & Content texts ───────────────────────────────────────────────────
  const textYStart = iconY + iconH + 6;

  if (diaryCase.cardType === 'photo') {
    // Polaroid title text written underneath the photograph frame
    const photoTitleStyle = new PIXI.TextStyle({
      fontFamily: 'Special Elite, serif',
      fontSize: 8.5,
      fill: 0x1c1a16,
      wordWrap: true,
      wordWrapWidth: CARD_W - 14,
      align: 'center',
    });
    const photoTitle = new PIXI.Text(diaryCase.title, photoTitleStyle);
    photoTitle.anchor.set(0.5, 0);
    photoTitle.x = CARD_W / 2;
    photoTitle.y = textYStart + 2;
    photoTitle.roundPixels = true;
    container.addChild(photoTitle);

    // Polaroid date written below the title like real handwriting
    const handwrittenDateStyle = new PIXI.TextStyle({
      fontFamily: 'Courier Prime, monospace',
      fontSize: 7.5,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: 0x7A2A1A,
      letterSpacing: 0.5,
    });
    const handDateText = new PIXI.Text(diaryCase.date, handwrittenDateStyle);
    handDateText.anchor.set(0.5, 0);
    handDateText.x = CARD_W / 2;
    handDateText.y = textYStart + photoTitle.height + 4;
    handDateText.roundPixels = true;
    container.addChild(handDateText);
  } else {
    // Normal case cards (Note, Clipping, Document)
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Special Elite, serif',
      fontSize: 9.0,
      fill: 0x1A1210,
      wordWrap: true,
      wordWrapWidth: CARD_W - 12,
    });
    const titleText = new PIXI.Text(diaryCase.title, titleStyle);
    titleText.x = 7;
    titleText.y = textYStart;
    titleText.roundPixels = true;
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
    excerptText.roundPixels = true;
    container.addChild(excerptText);
  }

  // ── Stamp overlay (Slightly smaller stamp) ───────────────────────────────────
  const stampContainer = new PIXI.Container();
  stampContainer.x = CARD_W / 2;
  stampContainer.y = CARD_H - 26;

  const stampBg = new PIXI.Graphics();
  const stampColour = STAMP_COLOURS[diaryCase.stampType] ?? 0x8B0000;
  stampBg.lineStyle(1.8, stampColour, 0.7);
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
  stampText.roundPixels = true;
  stampContainer.addChild(stampText);
  stampContainer.rotation = -0.18;
  stampContainer.alpha = 0.72;
  container.addChild(stampContainer);

  // ── Red Pin with 3D shadow & metallic pin needles ────────────────────────────
  const pinContainer = new PIXI.Container();
  pinContainer.x = CARD_W / 2;
  pinContainer.y = -2;

  // Pin Shadow (offset slightly)
  const pinShadow = new PIXI.Graphics();
  pinShadow.beginFill(0x000000, 0.3);
  pinShadow.drawCircle(1.5, 2.5, PIN_R - 0.5);
  pinShadow.endFill();
  pinContainer.addChild(pinShadow);

  // Metallic needle lines sticking into board
  const pinNeedle = new PIXI.Graphics();
  pinNeedle.lineStyle(1.2, 0x888888, 0.75);
  pinNeedle.moveTo(0, 0);
  pinNeedle.lineTo(1.5, 5);
  pinContainer.addChild(pinNeedle);

  // Pin Head dome (Shiny red push-pin bead)
  const pinHead = new PIXI.Graphics();
  pinHead.beginFill(0xCC1111, 1.0);
  pinHead.drawCircle(0, 0, PIN_R);
  pinHead.endFill();
  // Highlight gloss dome reflections
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
