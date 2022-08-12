import { useSymbolPreview, useSymbolState } from '../../states/symbolState';
import Symbol from './Symbols/Symbol';

const Symbols: React.FC = () => {
  const { symbols } = useSymbolState();
  const { getSymbolPreview } = useSymbolPreview();
  const previewSymbol = getSymbolPreview();

  return (
    <>
      {Array.from(symbols.values())
        .flat()
        .map((s) => s && <Symbol isPreview={false} symbol={s} />)}
      {previewSymbol && <Symbol isPreview symbol={previewSymbol} />}
    </>
  );
};

export default Symbols;
