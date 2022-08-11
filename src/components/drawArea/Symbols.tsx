import { Mode } from '../../helpers/modehelper';
import { useIsolatedNode } from '../../hooks/useIsoratedNode';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useLog } from '../../states/logState';
import { ModalTypes, useSingleModal } from '../../states/modalState';
import { useMode } from '../../states/modeState';
import { useNodeState } from '../../states/nodeState';
import { useSymbol, useSymbolPreview } from '../../states/symbolState';
import Symbol from './Symbols/Symbol';

const Symbols: React.FC = () => {
  const { symbols } = useSymbol();
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const { getSymbolPreview, setSymbolPreview } = useSymbolPreview();
  const { mode, setCopyObjectType } = useMode();
  const { removeSymbol } = useSymbol();
  const { isIsolatedNode } = useIsolatedNode();
  const { removeNode } = useNodeState();
  const { setLog } = useLog();
  const { setOpen } = useSingleModal(ModalTypes.SYMBOL_CONFIG);

  return (
    <>
      {Array.from(symbols.values())
        .flat()
        .map(
          (s) =>
            s.point && (
              <Symbol
                symbolState={s}
                point={s.point}
                key={`symbol_${s.key}`}
                onContextMenu={() => {
                  setOpen(s);
                }}
                onClick={() => {
                  switch (mode) {
                    case Mode.CUT:
                      removeSymbol(s);
                      s.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
                      setLog();
                      break;
                    case Mode.MOVE:
                      removeSymbol(s);
                      s.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
                      setLog();
                      setCopyObjectType(Mode.SYMBOL);
                      setSymbolPreview({ ...s, key: '', nodeIds: [] });
                      if (s.point) setCursorPosition(s.point);
                      break;
                    case Mode.COPY:
                      setCopyObjectType(Mode.SYMBOL);
                      setSymbolPreview({ ...s, key: '', nodeIds: [] });
                      if (s.point) setCursorPosition(s.point);
                      break;
                    default:
                  }
                }}
              />
            )
        )}
      {cursorPosition && <Symbol symbolState={getSymbolPreview()} point={cursorPosition} key="symbol_preview" />}
    </>
  );
};

export default Symbols;
