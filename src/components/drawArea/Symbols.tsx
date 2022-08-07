import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  logSelector,
  modeAtom,
  pitchAtom,
  previewSymbolAtom,
  symbolConfigAtom,
  symbolConfigModalAtom,
  symbolsAtom,
  upperLeftAtom,
  cursorPositionAtom,
} from '../../atoms';
import { Mode } from '../../helpers/modehelper';
import { useSymbol } from '../../hooks/useSymbol';
import Symbol from './Symbol';

export const Symbols: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const symbols = useRecoilValue(symbolsAtom);
  const cursorPosition = useRecoilValue(cursorPositionAtom);
  const [previewSymbol, setPreviewSymbol] = useRecoilState(previewSymbolAtom);
  const mode = useRecoilValue(modeAtom);
  const { removeSymbol } = useSymbol();
  const setLogs = useSetRecoilState(logSelector);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);
  const setConfigSymbolModal = useSetRecoilState(symbolConfigModalAtom);
  const setConfigSymbol = useSetRecoilState(symbolConfigAtom);

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
                  setConfigSymbolModal(true);
                  setConfigSymbol(c);
                }}
                onClick={() => {
                  switch (mode) {
                    case Mode.CUT:
                      removeSymbol(c);
                      setLogs();
                      break;
                    case Mode.MOVE:
                      removeSymbol(c);
                      setLogs();
                      setCopyObjectType(Mode.SYMBOL);
                      setPreviewSymbol({ ...c, key: '' });
                      break;
                    case Mode.COPY:
                      setCopyObjectType(Mode.SYMBOL);
                      setPreviewSymbol({ ...c, key: '' });
                      break;
                    default:
                  }
                }}
              />
            )
        )}
      {previewSymbol && cursorPosition && (
        <Symbol
          symbolState={previewSymbol}
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
