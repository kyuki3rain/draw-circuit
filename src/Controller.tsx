/* eslint-disable jsx-a11y/tabindex-no-positive */

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef } from 'react';

import './App.css';
import { RealPoint } from './helpers/gridhelper';
import { Mode, modeToCursorStyle } from './helpers/modehelper';
import { usePreview } from './hooks/usePreview';
import { useGrid } from './states/gridState';
import { useRoll } from './states/logState';
import { useModal } from './states/modalState';
import { useMode } from './states/modeState';

type Props = {
  children: React.ReactNode;
};

const Controller: React.FC<Props> = ({ children }) => {
  const { zoom, move, toFixedVirtualGrid } = useGrid();
  const { mode, setMode, copyObjectType } = useMode();
  const { setPreview, resetPreview } = usePreview();
  const { undo, canUndo, redo, canRedo } = useRoll();
  const { open } = useModal();

  const divref = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey) {
      zoom(e.deltaY < 0, { x: e.clientX, y: e.clientY });
    } else {
      move({ x: e.deltaX, y: e.deltaY });
    }
  };

  useEffect(() => {
    divref.current?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      divref.current?.removeEventListener('wheel', onWheel);
    };
  });

  useEffect(() => {
    resetPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div
      ref={divref}
      tabIndex={1}
      onKeyDown={(e) => {
        if (open) return;

        switch (e.code) {
          case 'Escape':
            setMode(Mode.NONE);
            if (mode === Mode.MOVE && copyObjectType !== Mode.NONE) undo();
            break;
          case 'KeyL':
            setMode(Mode.WIRE);
            break;
          case 'KeyP':
            setMode(Mode.SYMBOL);
            break;
          case 'KeyE':
            zoom(true);
            break;
          case 'KeyR':
            zoom(false);
            break;
          case 'KeyZ':
            if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
              if (e.shiftKey) {
                if (canRedo) redo();
              } else if (canUndo) undo();
            }
            break;
          default:
        }
      }}
      onMouseMove={(e) => {
        if (open) return;

        const pos: RealPoint = { x: e.clientX, y: e.clientY };
        const vpos = toFixedVirtualGrid(pos);
        setPreview(vpos);
      }}
      style={{ cursor: modeToCursorStyle(mode) }}
    >
      {children}
    </div>
  );
};

export default Controller;
