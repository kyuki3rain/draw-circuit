import React, { useEffect } from 'react';

import { RealPoint } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';
import { usePreview } from '../hooks/usePreview';
import { useWindowSize } from '../hooks/useWindowSize';
import { useGridState } from '../states/gridState';
import { useLabelState } from '../states/labelState';
import { useLog } from '../states/logState';
import { useMode } from '../states/modeState';
import { useSymbol } from '../states/symbolState';
import { useText } from '../states/textState';
import { useWire } from '../states/wireState';
import Grid from './drawArea/Grid';
import Labels from './drawArea/Labels';
import Node from './drawArea/Node';
import { Symbols } from './drawArea/Symbols';
import Text from './drawArea/Text';
import Wire from './drawArea/Wire';

const DrawArea: React.FC = () => {
  const { height, width } = useWindowSize();

  const { setWire } = useWire();
  const { setSymbol } = useSymbol();
  const { setLabel } = useLabelState();
  const { setText } = useText();
  const { toFixedVirtualPoint } = useGridState();
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
        const vpos = toFixedVirtualPoint(pos);

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
      <Labels />
      <Node />
      <Text />
    </svg>
  );
};

export default DrawArea;
