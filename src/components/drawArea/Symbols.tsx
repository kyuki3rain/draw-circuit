import { useRecoilValue, useSetRecoilState } from 'recoil';
import { copyObjectTypeAtom, modeAtom, pitchAtom, symbolConfigAtom, upperLeftAtom } from '../../atoms';
import { Mode } from '../../helpers/modehelper';
import { useLog } from '../../states/logState';
import Symbol from './Symbol';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useSymbol, useSymbolPreview } from '../../states/symbolState';
import { useIsolatedNode } from '../../hooks/useIsoratedNode';
import { useNode } from '../../states/nodeState';
import { ModalTypes, useModal } from '../../states/modalState';

export const Symbols: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { symbols } = useSymbol();
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const { getSymbolPreview, setSymbolPreview } = useSymbolPreview();
  const mode = useRecoilValue(modeAtom);
  const { removeSymbol } = useSymbol();
  const { isIsolatedNode } = useIsolatedNode();
  const { removeNode } = useNode();
  const { setLog } = useLog();
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);
  const { setOpen } = useModal();
  const setSymbolConfig = useSetRecoilState(symbolConfigAtom);

  return (
    <>
      {Array.from(symbols.values())
        .flat()
        .map(
          (c) =>
            c.point && (
              <Symbol
                symbolState={c}
                upperLeft={upperLeft}
                point={c.point}
                pitch={pitch}
                key={`symbol_${c.key}`}
                onContextMenu={() => {
                  setOpen(ModalTypes.SYMBOL_CONFIG);
                  setSymbolConfig(c);
                }}
                onClick={() => {
                  switch (mode) {
                    case Mode.CUT:
                      removeSymbol(c);
                      c.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
                      setLog();
                      break;
                    case Mode.MOVE:
                      removeSymbol(c);
                      c.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
                      setLog();
                      setCopyObjectType(Mode.SYMBOL);
                      setSymbolPreview({ ...c, key: '', nodeIds: [] });
                      if (c.point) setCursorPosition(c.point);
                      break;
                    case Mode.COPY:
                      setCopyObjectType(Mode.SYMBOL);
                      setSymbolPreview({ ...c, key: '', nodeIds: [] });
                      if (c.point) setCursorPosition(c.point);
                      break;
                    default:
                  }
                }}
              />
            )
        )}
      {cursorPosition && (
        <Symbol
          symbolState={getSymbolPreview()}
          upperLeft={upperLeft}
          point={cursorPosition}
          pitch={pitch}
          key="symbol_preview"
        />
      )}
    </>
  );
};

export default Symbols;
