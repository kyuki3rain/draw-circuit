import React, { useEffect } from 'react';
import Grid from './drawArea/Grid';
import { Symbols } from './drawArea/Symbols';
import { RealPoint } from '../helpers/gridhelper';
import { useWindowSize } from '../hooks/useWindowSize';
import { Mode } from '../helpers/modehelper';
import Wire from './drawArea/Wire';
import Label from './drawArea/Label';
import Node from './drawArea/Node';
import Text from './drawArea/Text';
import { usePreview } from '../hooks/usePreview';
import { useLog } from '../states/logState';
import { useWire } from '../states/wireState';
import { useLabel } from '../states/labelState';
import { useText } from '../states/textState';
import { useSymbol } from '../states/symbolState';
import { useGrid } from '../states/gridState';
import { useMode } from '../states/modeState';

const DrawArea: React.FC = () => {
  const { height, width } = useWindowSize();

  const { setWire } = useWire();
  const { setSymbol } = useSymbol();
  const { setLabel } = useLabel();
  const { setText } = useText();
  const { toFixedVirtualGrid } = useGrid();
  const { mode, setMode, copyObjectType } = useMode();
  const { setLog } = useLog();
  const { resetPreview } = usePreview();

  useEffect(() => {
    setLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'fixed', right: 0 }}
      viewBox={`0, 0, ${width}, ${height}`}
      onClick={(e) => {
        const pos: RealPoint = { x: e.clientX, y: e.clientY };
        const vpos = toFixedVirtualGrid(pos);

        switch (mode) {
          case Mode.WIRE:
            setWire(vpos, true);
            setLog();
            break;
          case Mode.SYMBOL:
            setSymbol(vpos);
            setLog();
            break;
          case Mode.LABEL:
            setLabel(vpos);
            setLog();
            break;
          case Mode.TEXT:
            setText(vpos);
            setMode(Mode.NONE);
            setLog();
            break;
          case Mode.MOVE:
            switch (copyObjectType) {
              case Mode.WIRE:
                setWire(vpos, false);
                setLog();
                break;
              case Mode.SYMBOL:
                setSymbol(vpos);
                setLog();
                break;
              case Mode.LABEL:
                setLabel(vpos);
                setLog();
                break;
              case Mode.TEXT:
                setText(vpos);
                setLog();
                break;
              default:
            }
            resetPreview();
            break;
          case Mode.COPY:
            switch (copyObjectType) {
              case Mode.WIRE:
                setWire(vpos, false);
                setLog();
                break;
              case Mode.SYMBOL:
                setSymbol(vpos);
                setLog();
                break;
              case Mode.LABEL:
                setLabel(vpos);
                setLog();
                break;
              case Mode.TEXT:
                setText(vpos);
                setLog();
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
            resetPreview();
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
