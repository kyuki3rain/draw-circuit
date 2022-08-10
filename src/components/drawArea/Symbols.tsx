import { useRecoilValue, useSetRecoilState } from 'recoil';
import { copyObjectTypeAtom, modeAtom, pitchAtom, upperLeftAtom } from '../../atoms';
import { Mode } from '../../helpers/modehelper';
import { useLog } from '../../states/logState';
import Symbol from './Symbol';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useSymbol, useSymbolPreview } from '../../states/symbolState';
import { useIsolatedNode } from '../../hooks/useIsoratedNode';
import { useNode } from '../../states/nodeState';
import { ModalTypes, useSingleModal } from '../../states/modalState';

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
                upperLeft={upperLeft}
                point={s.point}
                pitch={pitch}
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
