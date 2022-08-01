import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const config = {
  center: { vx: 2, vy: 2 },
  width: 4,
  height: 5,
};

const Signal: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <svg
      x={center.x - config.center.vx * pitch}
      y={center.y - config.center.vy * pitch}
      width={config.width * pitch}
      height={config.height * pitch}
    >
      <svg viewBox="-4 -4 408 508">
        <circle cx={200} cy={250} r={200} stroke="black" strokeWidth={8} fill="none" />
        <path d="M 50,250 A 75 75 0 0 1 200,250" fill="none" stroke="black" strokeWidth={8} />
        <path d="M 350,250 A 75 75 0 0 1 200,250" fill="none" stroke="black" strokeWidth={8} />
        <line x1="200" y1="50" x2="200" y2="0" stroke="black" strokeWidth={8} />
        <line x1="200" y1="450" x2="200" y2="500" stroke="black" strokeWidth={8} />
      </svg>
    </svg>
  );
};

export default Signal;
