import { useRecoilValue, useSetRecoilState } from 'recoil';
import { logSelector, modeAtom, pitchAtom, previewSymbolAtom, symbolsAtom, upperLeftAtom } from '../../atoms';
import { Mode } from '../../helpers/modehelper';
import { useSymbol } from '../../hooks/useSymbol';
import Symbol from './Symbol';

export const Symbols: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const symbols = useRecoilValue(symbolsAtom);
  const previewSymbol = useRecoilValue(previewSymbolAtom);
  const mode = useRecoilValue(modeAtom);
  const { removeSymbol } = useSymbol();
  const setLogs = useSetRecoilState(logSelector);

  return (
    <>
      {Array.from(symbols.values())
        .flat()
        .map((c) => (
          <Symbol
            componentName={c.type}
            upperLeft={upperLeft}
            point={c.point}
            pitch={pitch}
            key={`symbol_${c.key}_${c.type}`}
            onClick={() => {
              if (mode === Mode.CUT) {
                removeSymbol(c);
                setLogs();
              }
            }}
          />
        ))}
      {previewSymbol && (
        <Symbol
          componentName={previewSymbol.type}
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
