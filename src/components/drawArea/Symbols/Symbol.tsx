import { getConfig, SymbolState } from '../../../helpers/symbolHelper';
import { useSymbol } from '../../../hooks/useSymbol';
import CollisionRect from './CollisionRect';
import ConfigText from './ConfigText';
import Svg from './Svg';

type Props = {
  isPreview?: boolean;
  symbol?: SymbolState;
};

const Symbol: React.FC<Props> = ({ isPreview, symbol: inSymbol }) => {
  const { upperLeft, onClick, onContextMenu, componentState, symbol } = useSymbol(isPreview, inSymbol);
  if (!upperLeft || !componentState) return null;

  return (
    <>
      <Svg upperLeft={upperLeft} width={componentState.width} height={componentState.height} svg={componentState.svg} />
      <CollisionRect
        upperLeft={upperLeft}
        width={componentState.width}
        height={componentState.height}
        onClick={onClick}
        onContextMenu={onContextMenu}
      />
      {!isPreview && (
        <ConfigText
          upperLeft={upperLeft}
          width={componentState.width}
          height={componentState.height}
          key={symbol.key}
          config={getConfig(symbol)}
        />
      )}
    </>
  );
};

export default Symbol;
