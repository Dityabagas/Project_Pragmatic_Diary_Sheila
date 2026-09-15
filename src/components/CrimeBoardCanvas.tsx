import React, { useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { DiaryCase } from '../types';
import { diaryCases } from '../data/diaryCases.data';
import { threads } from '../data/threads.data';
import { createCardSprite } from '../utils/createCardSprite';
import { drawThreads, createCodeLetters, createQuestionMark } from '../utils/drawThreads';
import { getScaledPos } from '../utils/coords';

interface Props {
  onCaseSelect: (c: DiaryCase) => void;
}

// "PRAGMATICS DIARY" tile layout constants (must match drawThreads.ts)
const LINE1_LEN = 10; // P R A G M A T I C S
const LINE2_LEN = 5;  // D I A R Y
const TILE = 46;
const GAP = 6;

const CrimeBoardCanvas: React.FC<Props> = ({ onCaseSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const initializedRef = useRef(false);

  const handleSelect = useCallback(
    (c: DiaryCase) => onCaseSelect(c),
    [onCaseSelect],
  );

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const el = containerRef.current;
    const W = el.clientWidth || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    // ── Init PixiJS ────────────────────────────────────────────────────────────
    const app = new PIXI.Application({
      width: W,
      height: H,
      backgroundColor: 0x1a1a18,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });
    appRef.current = app;
    el.appendChild(app.view as HTMLCanvasElement);

    // ── Board background ───────────────────────────────────────────────────────
    const bgLayer = new PIXI.Container();
    app.stage.addChild(bgLayer);

    // Cork/felt texture background
    const bgGfx = new PIXI.Graphics();
    bgGfx.beginFill(0x1c1c1a);
    bgGfx.drawRect(0, 0, W, H);
    bgGfx.endFill();

    // Subtle dot-grid texture overlay
    bgGfx.lineStyle(0);
    for (let gx = 0; gx < W; gx += 22) {
      for (let gy = 0; gy < H; gy += 22) {
        const alpha = 0.025 + Math.random() * 0.03;
        bgGfx.beginFill(0xA08060, alpha);
        bgGfx.drawCircle(gx + Math.random() * 4, gy + Math.random() * 4, 0.8);
        bgGfx.endFill();
      }
    }

    // Vignette
    const vignette = new PIXI.Graphics();
    const vigSteps = 12;
    for (let i = 0; i < vigSteps; i++) {
      const t = i / vigSteps;
      const alpha = t * t * 0.7;
      const pad = t * Math.min(W, H) * 0.55;
      vignette.lineStyle(Math.min(W, H) * 0.055 / vigSteps, 0x000000, alpha);
      vignette.drawRect(pad, pad, W - pad * 2, H - pad * 2);
    }

    bgLayer.addChild(bgGfx);
    bgLayer.addChild(vignette);

    // ── Thread graphics layer (below cards) ───────────────────────────────────
    const threadGfx = new PIXI.Graphics();
    app.stage.addChild(threadGfx);

    // ── Build card map ─────────────────────────────────────────────────────────
    const cardMap = new Map<string, PIXI.Container>();
    const cardLayer = new PIXI.Container();
    app.stage.addChild(cardLayer);

    diaryCases.forEach((dc) => {
      const card = createCardSprite(dc, W, H, handleSelect);
      cardMap.set(dc.id, card);
      cardLayer.addChild(card);
    });

    // ── Decorative elements ────────────────────────────────────────────────────
    const codeLetters = createCodeLetters(app.stage, W, H);
    const qMark = createQuestionMark(app.stage, W, H);

    // ── Ticker loop ────────────────────────────────────────────────────────────
    let elapsed = 0;

    app.ticker.add((delta) => {
      elapsed += delta * 0.016; // convert to seconds at 60fps

      // Animate case cards
      cardMap.forEach((container) => {
        const s = (container as any).__animState;
        if (!s) return;

        // Smooth scale lerp
        s.currentScale += (s.targetScale - s.currentScale) * 0.12;
        container.scale.set(s.currentScale);

        // Floating oscillation
        const yOff = Math.sin(elapsed * s.floatSpeed + s.floatPhase) * 5;
        const rotOff = Math.sin(elapsed * s.floatSpeed * 0.7 + s.floatPhase) * 0.012;
        container.x = s.baseX + Math.cos(elapsed * s.floatSpeed * 0.5 + s.floatPhase + 1) * 1.5;
        container.y = s.baseY + yOff;
        container.rotation = s.baseRotation + rotOff;

        // Hover: pin pulse glow
        const pin = (container as any).__pin as PIXI.Graphics | undefined;
        if (pin && s.isHovered) {
          const pulse = (Math.sin(elapsed * 6) + 1) / 2; // 0–1
          pin.alpha = 0.7 + pulse * 0.3;
          pin.scale.set(1 + pulse * 0.25);
        } else if (pin) {
          pin.alpha = 1;
          pin.scale.set(1);
        }
      });

      // Animate PRAGMATICS DIARY letter tiles
      codeLetters.forEach((c) => {
        const bx = (c as any).__baseX;
        const by = (c as any).__baseY;
        const fp = (c as any).__floatPhase;
        const fs = (c as any).__floatSpeed;
        c.x = bx + Math.cos(elapsed * fs * 0.5 + fp) * 1.5;
        c.y = by + Math.sin(elapsed * fs + fp) * 4;
        c.rotation = Math.sin(elapsed * fs * 0.4 + fp) * 0.04;
      });

      // Redraw threads every frame to follow card positions
      drawThreads(threadGfx, threads, cardMap);
    });

    // ── Resize handler ─────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!appRef.current || !containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      appRef.current.renderer.resize(nw, nh);

      // Reposition cards proportionally inside the safe box
      cardMap.forEach((container) => {
        const s = (container as any).__animState;
        if (!s) return;
        const pos = getScaledPos(s.caseData.xPct, s.caseData.yPct, nw, nh);
        s.baseX = pos.x;
        s.baseY = pos.y;
        container.x = s.baseX;
        container.y = s.baseY;
      });

      // Reposition PRAGMATICS DIARY letter tiles
      const totalLine1W = LINE1_LEN * TILE + (LINE1_LEN - 1) * GAP;
      const totalLine2W = LINE2_LEN * TILE + (LINE2_LEN - 1) * GAP;
      const centerX = nw / 2;
      const centerY = nh / 2;

      codeLetters.forEach((c, i) => {
        let cx: number, cy: number;
        if (i < LINE1_LEN) {
          // Line 1: PRAGMATICS
          cx = centerX - totalLine1W / 2 + i * (TILE + GAP) + TILE / 2;
          cy = centerY - (TILE + GAP) / 2 - 4;
        } else {
          // Line 2: DIARY
          const j = i - LINE1_LEN;
          cx = centerX - totalLine2W / 2 + j * (TILE + GAP) + TILE / 2;
          cy = centerY + (TILE + GAP) / 2 + 4;
        }
        (c as any).__baseX = cx;
        (c as any).__baseY = cy;
        c.x = cx;
        c.y = cy;
      });

      // Reposition question mark proportionally
      const qPos = getScaledPos(0.21, 0.52, nw, nh);
      (qMark as any).__baseX = qPos.x;
      (qMark as any).__baseY = qPos.y;
      qMark.x = qPos.x;
      qMark.y = qPos.y;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [handleSelect]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: '#1c1c1a' }}
    />
  );
};

export default CrimeBoardCanvas;
