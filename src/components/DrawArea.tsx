import React from 'react';
import { useRecoilState } from 'recoil';
import Grid from './drawArea/Grid';
import { Symbol } from './drawArea/Symbol';
import { RealPoint, toFixedVirtualGrid } from '../helpers/gridhelper';
import { useWindowSize } from '../hooks/useWindowSize';
import { useWire } from '../hooks/useWire';
import { Mode } from '../helpers/modehelper';
import { modeAtom, pitchAtom, upperLeftAtom } from '../atoms';
import Wire from './drawArea/Wire';
import { useSymbol } from '../hooks/useSymbol';
import { useLabel } from '../hooks/useLabel';
import Label from './drawArea/Label';
import Node from './drawArea/Node';

const DrawArea: React.FC = () => {
  const { height, width } = useWindowSize();

  const { setWire } = useWire();
  const { setSymbol } = useSymbol();
  const { setLabel } = useLabel();
  const [pitch] = useRecoilState(pitchAtom);
  const [upperLeft] = useRecoilState(upperLeftAtom);
  const [mode] = useRecoilState(modeAtom);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'fixed', right: 0 }}
      viewBox={`0, 0, ${width}, ${height}`}
      onClick={(e) => {
        const pos: RealPoint = { x: e.clientX, y: e.clientY };
        const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
        switch (mode) {
          case Mode.WIRE:
            setWire(vpos);
            break;
          case Mode.SYMBOL:
            setSymbol(vpos);
            break;
          case Mode.LABEL:
            setLabel(vpos);
            break;
          default:
        }
      }}
    >
      <Grid />
      <Wire />
      <Symbol />
      <Label />
      <Node />
    </svg>
  );
};

export default DrawArea;
