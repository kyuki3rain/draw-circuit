import SVG from 'react-inlinesvg';

import { sub, VirtualPoint } from '../../../helpers/gridhelper';
import { getConfig, SymbolState } from '../../../helpers/symbolHelper';
import { useComponent } from '../../../states/componentState';
import { useGridState } from '../../../states/gridState';

type Props = {
  symbolState: SymbolState | null;
  point: VirtualPoint;
  onClick?: () => void;
  onContextMenu?: () => void;
};

const Symbol: React.FC<Props> = ({ symbolState, point, onClick, onContextMenu }) => {
  const { toRealPoint, toRealGrid } = useGridState();
  const { componentState } = useComponent(symbolState?.componentName);
  if (!symbolState) return null;
  if (!componentState) return null;

  const center = toRealPoint(sub(point, componentState.center));
  const width = toRealGrid(componentState.width);
  const height = toRealGrid(componentState.height);

  return (
    <svg>
      <svg x={center.x} y={center.y} width={width} height={height}>
        <SVG src={componentState.svg} />
      </svg>
      <rect
        x={center.x}
        y={center.y}
        fill="black"
        fillOpacity="0"
        width={width}
        height={height}
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          if (onContextMenu) onContextMenu();
        }}
      >
        {' '}
      </rect>
      {symbolState.key !== 'symbol_preview' && (
        <>
          {' '}
          <text
            x={center.x + width + 20}
            y={center.y + 20}
            fontFamily="monospace, monospace"
            fontWeight="bold"
            fontSize="20"
            fontStyle="italic"
          >
            {symbolState.key}
          </text>
          <text
            x={center.x + width + 20}
            y={center.y + height}
            fontFamily="monospace, monospace"
            fontWeight="bold"
            fontSize="20"
            fontStyle="italic"
          >
            {getConfig(symbolState)}
          </text>
        </>
      )}
    </svg>
  );
};

export default Symbol;
