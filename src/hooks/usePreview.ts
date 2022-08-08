import { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  previewLabelNameAtom,
  previewSymbolAtom,
  previewTextAtom,
  componentStateFamily,
  modeAtom,
} from '../atoms';

import { add, VirtualPoint } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';
import { useCursorPosition } from '../states/cursorPositionState';
import { useWirePreviewWithNode, useWirePreviewWithoutNode } from '../states/wireState';

export const usePreview = () => {
  const { resetWirePreviewWithNode } = useWirePreviewWithNode();
  const { resetWirePreviewWithoutNode } = useWirePreviewWithoutNode();
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const { setCursorPosition } = useCursorPosition();
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const resetPreview = useCallback(() => {
    resetWirePreviewWithNode();
    resetWirePreviewWithoutNode();
    setPreviewSymbol(null);
    setPreviewLabelName('');
    setPreviewText(null);
    setCopyObjectType(Mode.NONE);
  }, [
    resetWirePreviewWithNode,
    resetWirePreviewWithoutNode,
    setPreviewSymbol,
    setPreviewLabelName,
    setPreviewText,
    setCopyObjectType,
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
  const symbol = useRecoilValue(previewSymbolAtom);
  const componentState = useRecoilValue(componentStateFamily(symbol?.componentName));
  const mode = useRecoilValue(modeAtom);
  const copyObjectType = useRecoilValue(copyObjectTypeAtom);
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
