import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface UsePixiAppOptions {
  backgroundColor?: number;
  transparent?: boolean;
}

export function usePixiApp(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UsePixiAppOptions = {},
): React.RefObject<PIXI.Application | null> {
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (appRef.current) return; // guard against StrictMode double-mount

    const el = containerRef.current;
    const W = el.clientWidth;
    const H = el.clientHeight;

    const app = new PIXI.Application({
      width: W,
      height: H,
      backgroundColor: options.backgroundColor ?? 0x1a1a18,
      backgroundAlpha: options.transparent ? 0 : 1,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });

    appRef.current = app;
    el.appendChild(app.view as HTMLCanvasElement);

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return appRef;
}
