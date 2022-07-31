import { toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Pmos4: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  return (
    <svg>
      <polyline
        points={`
          ${center.x + 2 * pitch}, ${center.y - 3 * pitch}
          ${center.x + 2 * pitch}, ${center.y - 2 * pitch}
          ${center.x}, ${center.y - 2 * pitch}
        `}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <line x1={center.x} y1={center.y} x2={center.x + 0.5 * pitch} y2={center.y} stroke="black" strokeWidth={2} />
      <polyline
        points={`
              ${center.x + 2 * pitch}, ${center.y}
              ${center.x + 0.5 * pitch}, ${center.y + 0.25 * pitch}
              ${center.x + 0.5 * pitch}, ${center.y - 0.25 * pitch}
              ${center.x + 2 * pitch}, ${center.y}
            `}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <polyline
        points={`
              ${center.x + 2 * pitch}, ${center.y + 3 * pitch}
              ${center.x + 2 * pitch}, ${center.y + 2 * pitch}
              ${center.x}, ${center.y + 2 * pitch}
            `}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <line
        x1={center.x}
        y1={center.y - 2.5 * pitch}
        x2={center.x}
        y2={center.y - 1.5 * pitch}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={center.x}
        y1={center.y - 0.5 * pitch}
        x2={center.x}
        y2={center.y + 0.5 * pitch}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={center.x}
        y1={center.y + 1.5 * pitch}
        x2={center.x}
        y2={center.y + 2.5 * pitch}
        stroke="black"
        strokeWidth={2}
      />
      <polyline
        points={`
              ${center.x - pitch}, ${center.y + 2 * pitch}
              ${center.x - 0.5 * pitch}, ${center.y + 2 * pitch}
              ${center.x - 0.5 * pitch}, ${center.y - 2 * pitch}
            `}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};

export default Pmos4;
