import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const config = {
  center: { vx: 2, vy: 2 },
  width: 4,
  height: 4,
};

const Cell: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <svg
      x={center.x - config.center.vx * pitch}
      y={center.y - config.center.vy * pitch}
      width={config.width * pitch}
      height={config.height * pitch}
    >
      <svg viewBox={`0 0 ${800} ${800}`}>
        <rect
          x={200}
          y={400}
          width={400}
          height={100}
          stroke="black"
          strokeWidth={20}
          fill="none"
          style={{ overflow: 'visible' }}
        />
        <line x1={400} y1={300} x2={400} y2={0} stroke="black" strokeWidth={20} />
        <line x1={400} y1={500} x2={400} y2={800} stroke="black" strokeWidth={20} />
        <line x1={0} y1={300} x2={800} y2={300} stroke="black" strokeWidth={20} />
      </svg>
    </svg>
  );
};

export default Cell;
