import { useCallback, useMemo } from 'react';

import { add, VirtualPoint } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';
import { useComponent } from '../states/componentState';
import { useCursorPosition } from '../states/cursorPositionState';
import { useLabelPreview } from '../states/labelState';
import { useMode } from '../states/modeState';
import { useSymbolPreview } from '../states/symbolState';
import { useTextPreview } from '../states/textState';
import { useWirePreviewWithNode, useWirePreviewWithoutNode } from '../states/wireState';

export const usePreview = () => {
  const { resetWirePreviewWithNode } = useWirePreviewWithNode();
  const { resetWirePreviewWithoutNode } = useWirePreviewWithoutNode();
  const { setCursorPosition, resetCursorPosition } = useCursorPosition();
  const { resetLabelPreview } = useLabelPreview();
  const { resetTextPreview } = useTextPreview();
  const { resetSymbolPreview } = useSymbolPreview();
  const { resetCopyObjecttype } = useMode();

  const resetPreview = useCallback(() => {
    resetWirePreviewWithNode();
    resetWirePreviewWithoutNode();
    resetTextPreview();
    resetSymbolPreview();
    resetLabelPreview();
    resetCursorPosition();
    resetCopyObjecttype();
  }, [
    resetWirePreviewWithNode,
    resetWirePreviewWithoutNode,
    resetTextPreview,
    resetSymbolPreview,
    resetLabelPreview,
    resetCursorPosition,
    resetCopyObjecttype,
  ]);

  const setPreview = useCallback(
    (point: VirtualPoint) => {
      setCursorPosition(point);
    },
    [setCursorPosition]
  );

  return { setPreview, resetPreview };
};

export const usePreviewNodePosition = () => {
  const { symbol } = useSymbolPreview();
  const { componentState } = useComponent(symbol?.componentName);
  const { mode, copyObjectType } = useMode();
  const { cursorPosition } = useCursorPosition();

  const previewNodePosition = useMemo(() => {
    if (!cursorPosition) return null;

    switch (mode) {
      case Mode.SYMBOL:
        return componentState?.nodePoints.map((p) => add(p, cursorPosition));
      case Mode.LABEL:
        return [cursorPosition];
      case Mode.MOVE:
      case Mode.COPY:
        switch (copyObjectType) {
          case Mode.SYMBOL:
            return componentState?.nodePoints.map((p) => add(p, cursorPosition));
          case Mode.LABEL:
            return [cursorPosition];
          default:
            return null;
        }
      default:
        return null;
    }
  }, [componentState?.nodePoints, copyObjectType, cursorPosition, mode]);

  return { previewNodePosition };
};
