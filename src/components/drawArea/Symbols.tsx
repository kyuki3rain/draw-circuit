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
  symbolTypeAtom,
  upperLeftAtom,
} from '../../atoms';
import { Mode } from '../../helpers/modehelper';
import { useSymbol } from '../../hooks/useSymbol';
import Symbol from './Symbol';

export const Symbols: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const symbols = useRecoilValue(symbolsAtom);
  const [previewSymbol, setPreviewSymbol] = useRecoilState(previewSymbolAtom);
  const mode = useRecoilValue(modeAtom);
  const { removeSymbol } = useSymbol();
  const setLogs = useSetRecoilState(logSelector);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);
  const setSymbolType = useSetRecoilState(symbolTypeAtom);
  const setConfigSymbolModal = useSetRecoilState(symbolConfigModalAtom);
  const setConfigSymbol = useSetRecoilState(symbolConfigAtom);

  return (
    <>
      {Array.from(symbols.values())
        .flat()
        .map((c) => (
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
                  setSymbolType(c.type);
                  setPreviewSymbol(null);
                  break;
                case Mode.COPY:
                  setCopyObjectType(Mode.SYMBOL);
                  setSymbolType(c.type);
                  setPreviewSymbol(null);
                  break;
                default:
              }
            }}
          />
        ))}
      {previewSymbol && (
        <Symbol
          symbolState={previewSymbol}
          upperLeft={upperLeft}
          point={previewSymbol.point}
          pitch={pitch}
          key="symbol_preview"
        />
      )}
    </>
  );
};

export default Symbols;
