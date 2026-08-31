export type StampType = 'EVIDENCE LOG' | 'CONFIDENTIAL' | 'SOLVED' | 'OPEN';
export type CardType = 'photo' | 'document' | 'note' | 'clipping';

export interface DiaryCase {
  id: string;
  caseNumber: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  stampType: StampType;
  xPct: number;   // 0–1, fraction of canvas width (card center anchor)
  yPct: number;   // 0–1, fraction of canvas height
  baseRotation: number; // radians
  floatSpeed: number;   // sin multiplier
  floatPhase: number;   // phase offset for staggered animation
  cardType: CardType;
  accentHex: number;    // PIXI hex colour for card accent bar
}

export interface Thread {
  fromId: string;
  toId: string;
}

// Internal runtime state stored in PIXI Container.__animState
export interface AnimState {
  baseX: number;
  baseY: number;
  baseRotation: number;
  floatSpeed: number;
  floatPhase: number;
  currentScale: number;
  targetScale: number;
  pinPulse: number;
  isHovered: boolean;
  caseData: DiaryCase;
}
