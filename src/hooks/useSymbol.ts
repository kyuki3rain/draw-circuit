import { useCallback, useMemo } from 'react';

import { sub } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';
import { SymbolState } from '../helpers/symbolHelper';
import { useComponent } from '../states/componentState';
import { useCursorPosition } from '../states/cursorPositionState';
import { useLog } from '../states/logState';
import { useSingleModal, ModalTypes } from '../states/modalState';
import { useMode } from '../states/modeState';
import { useNodeState } from '../states/nodeState';
import { useSymbolPreview, useSymbolState } from '../states/symbolState';
import { useIsolatedNode } from './useIsoratedNode';

export const useSymbol = (isPreview?: boolean, inSymbol?: SymbolState | null) => {
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const { getSymbolPreview, setSymbolPreview } = useSymbolPreview();
  const { mode, setCopyObjectType } = useMode();
  const { removeSymbol } = useSymbolState();
  const { isIsolatedNode } = useIsolatedNode();
  const { removeNode } = useNodeState();
  const { setLog } = useLog();
  const { setOpen } = useSingleModal(ModalTypes.SYMBOL_CONFIG);

  const symbol = useMemo(
    () => (isPreview ? getSymbolPreview() : inSymbol) ?? ({} as SymbolState),
    [getSymbolPreview, inSymbol, isPreview]
  );
  const { componentState } = useComponent(symbol.componentName);

  const onClick = useCallback(() => {
    switch (mode) {
      case Mode.CUT:
        removeSymbol(symbol);
        symbol.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
        setLog();
        break;
      case Mode.MOVE:
        removeSymbol(symbol);
        symbol.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
        setLog();
        setCopyObjectType(Mode.SYMBOL);
        setSymbolPreview({ ...symbol, key: '', nodeIds: [] });
        if (symbol.point) setCursorPosition(symbol.point);
        break;
      case Mode.COPY:
        setCopyObjectType(Mode.SYMBOL);
        setSymbolPreview({ ...symbol, key: '', nodeIds: [] });
        if (symbol.point) setCursorPosition(symbol.point);
        break;
      default:
    }
  }, [
    isIsolatedNode,
    mode,
    removeNode,
    removeSymbol,
    setCopyObjectType,
    setCursorPosition,
    setLog,
    setSymbolPreview,
    symbol,
  ]);

  const onContextMenu = useCallback(() => {
    setOpen(symbol);
  }, [setOpen, symbol]);

  const center = useMemo(
    () => (isPreview ? cursorPosition : symbol.point) ?? null,
    [cursorPosition, isPreview, symbol.point]
  );
  const upperLeft = useMemo(
    () => center && componentState && sub(center, componentState.center),
    [center, componentState]
  );

  return {
    center,
    upperLeft,
    onClick,
    onContextMenu,
    componentState,
    symbol,
  };
};
