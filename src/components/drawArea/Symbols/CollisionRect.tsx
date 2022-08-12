import { VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';

type Props = {
  upperLeft: VirtualPoint;
  width: number;
  height: number;
  onClick: () => void;
  onContextMenu: () => void;
};

const CollisionRect: React.FC<Props> = ({ upperLeft, width, height, onClick, onContextMenu }) => {
  const { toRealGrid, toRealPoint } = useGridState();
  const realUL = toRealPoint(upperLeft);
  const realW = toRealGrid(width);
  const realH = toRealGrid(height);
  return (
    <rect
      x={realUL.x}
      y={realUL.y}
      fill="black"
      fillOpacity="0"
      width={realW}
      height={realH}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onContextMenu) onContextMenu();
      }}
    />
  );
};

export default CollisionRect;
