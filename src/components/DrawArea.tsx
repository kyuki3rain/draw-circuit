import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Grid from './drawArea/Grid';
import { Symbols } from './drawArea/Symbols';
import { RealPoint, toFixedVirtualGrid } from '../helpers/gridhelper';
import { useWindowSize } from '../hooks/useWindowSize';
import { useWire } from '../hooks/useWire';
import { Mode } from '../helpers/modehelper';
import { copyObjectTypeAtom, logSelector, modeAtom, pitchAtom, upperLeftAtom } from '../atoms';
import Wire from './drawArea/Wire';
import { useSymbol } from '../hooks/useSymbol';
import { useLabel } from '../hooks/useLabel';
import Label from './drawArea/Label';
import Node from './drawArea/Node';
import Text from './drawArea/Text';
import { usePreview } from '../hooks/usePreview';
import { useText } from '../hooks/useText';

const DrawArea: React.FC = () => {
  const { height, width } = useWindowSize();

  const { setWire, setCopyWire } = useWire();
  const { setSymbol } = useSymbol();
  const { setLabel } = useLabel();
  const { setText } = useText();
  const [pitch] = useRecoilState(pitchAtom);
  const [upperLeft] = useRecoilState(upperLeftAtom);
  const [mode, setMode] = useRecoilState(modeAtom);
  const setLogs = useSetRecoilState(logSelector);
  const { resetPreview } = usePreview();
  const copyObjectType = useRecoilValue(copyObjectTypeAtom);

  useEffect(() => {
    setLogs();
  }, []);

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
            setLogs();
            break;
          case Mode.SYMBOL:
            setSymbol(vpos);
            setLogs();
            break;
          case Mode.LABEL:
            setLabel(vpos);
            setLogs();
            break;
          case Mode.TEXT:
            setText(vpos);
            setMode(Mode.NONE);
            setLogs();
            break;
          case Mode.MOVE:
            switch (copyObjectType) {
              case Mode.WIRE:
                setCopyWire(vpos);
                resetPreview(Mode.MOVE);
                setLogs();
                break;
              case Mode.SYMBOL:
                setSymbol(vpos);
                resetPreview(Mode.MOVE);
                setLogs();
                break;
              case Mode.LABEL:
                setLabel(vpos);
                resetPreview(Mode.MOVE);
                setLogs();
                break;
              case Mode.TEXT:
                setText(vpos);
                resetPreview(Mode.MOVE);
                setLogs();
                break;
              default:
            }
            break;
          case Mode.COPY:
            switch (copyObjectType) {
              case Mode.WIRE:
                setCopyWire(vpos);
                setLogs();
                break;
              case Mode.SYMBOL:
                setSymbol(vpos);
                setLogs();
                break;
              case Mode.LABEL:
                setLabel(vpos);
                setLogs();
                break;
              case Mode.TEXT:
                setText(vpos);
                setLogs();
                break;
              default:
            }
            break;
          default:
        }
      }}
      onContextMenu={(e) => {
        switch (mode) {
          case Mode.WIRE:
            e.preventDefault();
            resetPreview(Mode.WIRE);
            return false;
          default:
            return true;
        }
      }}
    >
      <Grid />
      <Wire />
      <Symbols />
      <Label />
      <Node />
      <Text />
    </svg>
  );
};

export default DrawArea;
