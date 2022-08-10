export type VirtualPoint = { vx: number; vy: number };
export type RealPoint = { x: number; y: number };

export const add = (vp1: VirtualPoint, vp2: VirtualPoint) => ({ vx: vp1.vx + vp2.vx, vy: vp1.vy + vp2.vy });

export const sub = (vp1: VirtualPoint, vp2: VirtualPoint) => ({ vx: vp1.vx - vp2.vx, vy: vp1.vy - vp2.vy });
export const fix = (vp: VirtualPoint) => ({ vx: Math.round(vp.vx), vy: Math.round(vp.vy) });

export const clip = (pitch: number) => Math.min(Math.max(5, pitch), 50);
