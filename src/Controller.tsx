/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef } from 'react';
import './App.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { add, RealPoint, sub, toFixedVirtualGrid, toVirtualGrid } from './helpers/gridhelper';
import { Mode, modeToCursorStyle } from './helpers/modehelper';
import { copyObjectTypeAtom, modalSelector, modeAtom, pitchAtom, upperLeftAtom } from './atoms';
import { usePreview } from './hooks/usePreview';
import { useRoll } from './states/logState';

type Props = {
  children: React.ReactNode;
};

const Controller: React.FC<Props> = ({ children }) => {
  const [pitch, setPitch] = useRecoilState(pitchAtom);
  const [upperLeft, setUpperLeft] = useRecoilState(upperLeftAtom);
  const [mode, setMode] = useRecoilState(modeAtom);
  const { setPreview, resetPreview } = usePreview();
  const { undo, canUndo, redo, canRedo } = useRoll();
  const open = useRecoilValue(modalSelector);
  const copyObjectType = useRecoilValue(copyObjectTypeAtom);

  const divref = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey) {
      const pos: RealPoint = { x: e.clientX, y: e.clientY };
      const rawVPos = toVirtualGrid(pos, pitch, upperLeft);

      let newPitch = pitch;
      if (e.deltaY < 0) newPitch += 1; // Zoom in
      else newPitch -= 1; // Zoom out

      newPitch = Math.min(Math.max(5, newPitch), 50);
      const newRawVPos = toVirtualGrid(pos, newPitch, upperLeft);

      setPitch(newPitch);
      setUpperLeft(add(upperLeft, sub(rawVPos, newRawVPos)));
    } else {
      setUpperLeft(add(upperLeft, toVirtualGrid({ x: e.deltaX, y: e.deltaY }, pitch, { vx: 0, vy: 0 })));
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
            setPitch(pitch + 1);
            break;
          case 'KeyR':
            setPitch(pitch - 1);
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
        const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
        setPreview(vpos);
      }}
      style={{ cursor: modeToCursorStyle(mode) }}
    >
      {children}
    </div>
  );
};

export default Controller;
