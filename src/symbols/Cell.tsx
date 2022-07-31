import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Cell: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <svg>
      <rect
        x={center.x - 1 * pitch}
        y={center.y}
        width={2 * pitch}
        height={0.5 * pitch}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <line
        x1={center.x}
        y1={center.y - 0.5 * pitch}
        x2={center.x}
        y2={center.y - 2 * pitch}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={center.x}
        y1={center.y + 0.5 * pitch}
        x2={center.x}
        y2={center.y + 2 * pitch}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={center.x - 2 * pitch}
        y1={center.y - 0.5 * pitch}
        x2={center.x + 2 * pitch}
        y2={center.y - 0.5 * pitch}
        stroke="black"
        strokeWidth={2}
      />
    </svg>
  );
};

export default Cell;
