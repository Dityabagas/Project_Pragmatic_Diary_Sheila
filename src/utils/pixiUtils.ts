import * as PIXI from 'pixi.js';
import { AnimState } from '../types';

export function getAnimState(container: PIXI.Container): AnimState | undefined {
  return (container as Record<string, unknown>).__animState as AnimState | undefined;
}

export function setAnimState(container: PIXI.Container, state: AnimState): void {
  (container as Record<string, unknown>).__animState = state;
}

export function getPinContainer(container: PIXI.Container): PIXI.Graphics | PIXI.Container | undefined {
  return (container as Record<string, unknown>).__pin as PIXI.Graphics | PIXI.Container | undefined;
}

export function setPinContainer(container: PIXI.Container, pin: PIXI.Container): void {
  (container as Record<string, unknown>).__pin = pin;
}

export function makeNonInteractive(gfx: PIXI.DisplayObject): void {
  gfx.interactive = false;
  (gfx as Record<string, unknown>).eventMode = 'none';
}
