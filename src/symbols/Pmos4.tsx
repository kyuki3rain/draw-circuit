import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const config = {
  center: { vx: 1, vy: 3 },
  width: 3,
  height: 6,
};

const Pmos4: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <svg
      x={center.x - config.center.vx * pitch}
      y={center.y - config.center.vy * pitch}
      width={config.width * pitch}
      height={config.height * pitch}
    >
      <svg viewBox="0 0 109 216">
        <polyline stroke="black" strokeWidth={4} fill="none" points="0 180 18 180 18 36" />
        <line stroke="black" strokeWidth={4} fill="none" x1="36" y1="18" x2="36" y2="54" />
        <line stroke="black" strokeWidth={4} fill="none" x1="36" y1="162" x2="36" y2="198" />
        <polygon stroke="black" strokeWidth={4} fill="none" points="108 108 54 99 54 108 54 117 108 108" />
        <line stroke="black" strokeWidth={4} fill="none" x1="36" y1="108" x2="54" y2="108" />
        <polyline stroke="black" strokeWidth={4} fill="none" points="36 36 108 36 108 18 108 0" />
        <polyline stroke="black" strokeWidth={4} fill="none" points="36 180 108 180 108 198 108 216" />
        <line stroke="black" strokeWidth={4} fill="none" x1="36" y1="90" x2="36" y2="126" />
      </svg>
    </svg>
  );
};

export default Pmos4;
