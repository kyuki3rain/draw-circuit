import { useRecoilValue } from 'recoil';
import SVG from 'react-inlinesvg';
import { toRealGrid, VirtualPoint } from '../../helpers/gridhelper';
import { componentStateFamily } from '../../atoms';
import { getConfig, SymbolState } from '../../helpers/symbolHelper';

type Props = {
  symbolState: SymbolState;
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
  onClick?: () => void;
  onContextMenu?: () => void;
};

const Symbol: React.FC<Props> = ({ symbolState, upperLeft, point, pitch, onClick, onContextMenu }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  const componentState = useRecoilValue(componentStateFamily(symbolState.componentName));
  if (!componentState) return null;
  return (
    <svg>
      <svg
        x={center.x - componentState.center.vx * pitch}
        y={center.y - componentState.center.vy * pitch}
        width={componentState.width * pitch}
        height={componentState.height * pitch}
      >
        <SVG src={componentState.svg} />
      </svg>
      <rect
        x={center.x - componentState.center.vx * pitch}
        y={center.y - componentState.center.vy * pitch}
        fill="black"
        fillOpacity="0"
        width={componentState.width * pitch}
        height={componentState.height * pitch}
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
            x={center.x - componentState.center.vx * pitch + componentState.width * pitch + 20}
            y={center.y - componentState.center.vy * pitch + 20}
            fontFamily="monospace, monospace"
            fontWeight="bold"
            fontSize="20"
            fontStyle="italic"
          >
            {symbolState.key}
          </text>
          <text
            x={center.x - componentState.center.vx * pitch + componentState.width * pitch + 20}
            y={center.y - componentState.center.vy * pitch + componentState.height * pitch}
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
