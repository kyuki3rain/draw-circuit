import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Cell: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <svg x={center.x - 2 * pitch} y={center.y - 2 * pitch} width={4 * pitch} height={4 * pitch}>
      <svg>
        <rect
          x={20}
          y={40}
          width={40}
          height={10}
          stroke="black"
          strokeWidth={2}
          fill="none"
          style={{ overflow: 'visible' }}
        />
        <line x1={40} y1={30} x2={40} y2={0} stroke="black" strokeWidth={2} />
        <line x1={40} y1={50} x2={40} y2={80} stroke="black" strokeWidth={2} />
        <line x1={0} y1={30} x2={80} y2={30} stroke="black" strokeWidth={2} />
      </svg>
    </svg>
  );
};

export default Cell;
