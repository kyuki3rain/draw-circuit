import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';
import { add, clip, fix, RealPoint, sub, VirtualPoint } from '../helpers/gridhelper';

const pitchAtom = atom({
  key: 'pitch',
  default: 20,
});

const upperLeftAtom = atom({
  key: 'upperLeft',
  default: { vx: 0, vy: 0 } as VirtualPoint,
});

const toVirtualGridWithoutState = (point: RealPoint, pitch: number, upperLeft: VirtualPoint) => ({
  vx: point.x / pitch + upperLeft.vx,
  vy: point.y / pitch + upperLeft.vy,
});

const toRealGridWithoutState = (point: VirtualPoint, pitch: number, upperLeft: VirtualPoint) => ({
  x: (point.vx - upperLeft.vx) * pitch,
  y: (point.vy - upperLeft.vy) * pitch,
});

const toFixedVirtualGridWithoutState = (point: RealPoint, pitch: number, upperLeft: VirtualPoint) =>
  fix(toVirtualGridWithoutState(point, pitch, upperLeft));

export const useGridState = () => {
  const [pitch, setPitch] = useRecoilState(pitchAtom);
  const [upperLeft, setUpperLeft] = useRecoilState(upperLeftAtom);

  const toVirtualPoint = useCallback(
    (point: RealPoint) => toVirtualGridWithoutState(point, pitch, upperLeft),
    [pitch, upperLeft]
  );
  const toFixedVirtualPoint = useCallback(
    (point: RealPoint) => toFixedVirtualGridWithoutState(point, pitch, upperLeft),
    [pitch, upperLeft]
  );

  const toRealPoint = useCallback(
    (point: VirtualPoint) => toRealGridWithoutState(point, pitch, upperLeft),
    [pitch, upperLeft]
  );

  const toRealGrid = useCallback((realLength: number) => realLength * pitch, [pitch]);
  const toVirtualGrid = useCallback((realLength: number) => realLength / pitch, [pitch]);
  const toFixedVirtualGrid = useCallback((realLength: number) => Math.round(realLength / pitch), [pitch]);

  const zoom = useCallback(
    (out: boolean, realPoint?: RealPoint) => {
      const newPitch = out ? clip(pitch + 1) : clip(pitch - 1);
      setPitch(newPitch);
      if (!realPoint) return;

      setUpperLeft((prev) => {
        const rawVPos = toVirtualGridWithoutState(realPoint, pitch, prev);
        const newRawVPos = toVirtualGridWithoutState(realPoint, newPitch, prev);
        return add(prev, sub(rawVPos, newRawVPos));
      });
    },
    [pitch, setPitch, setUpperLeft]
  );

  const move = useCallback(
    (realPoint: RealPoint) =>
      setUpperLeft((prev) => add(prev, toVirtualGridWithoutState(realPoint, pitch, { vx: 0, vy: 0 }))),
    [pitch, setUpperLeft]
  );

  const correction = {
    vertical: Math.ceil(upperLeft.vx) - upperLeft.vx,
    horizontal: Math.ceil(upperLeft.vy) - upperLeft.vy,
  };

  const getGridArray = useCallback((length: number) => [...(Array(Math.ceil(length / pitch)) as number[])], [pitch]);

  return {
    toVirtualPoint,
    toFixedVirtualPoint,
    toRealPoint,
    toVirtualGrid,
    toFixedVirtualGrid,
    toRealGrid,
    zoom,
    move,
    getGridArray,
    correction,
  };
};
