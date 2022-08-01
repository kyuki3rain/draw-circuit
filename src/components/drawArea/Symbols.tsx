import { useRecoilValue } from 'recoil';
import { pitchAtom, previewSymbolAtom, symbolsAtom, upperLeftAtom } from '../../atoms';
import Symbol from './Symbol';

export const Symbols: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const symbols = useRecoilValue(symbolsAtom);
  const previewSymbol = useRecoilValue(previewSymbolAtom);

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
