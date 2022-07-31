import { add, toRealGrid, VirtualPoint } from '../helpers/gridhelper';

type Props = {
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Signal: React.FC<Props> = ({ upperLeft, point, pitch }) => {
  const circleCenter = toRealGrid(add(point, { vx: 0, vy: 0.5 }), pitch, upperLeft);
  return (
    <svg>
      <circle cx={circleCenter.x} cy={circleCenter.y} r={2 * pitch} stroke="black" strokeWidth={2} fill="none" />
      <path
        d={`M ${circleCenter.x - 1.5 * pitch},${circleCenter.y} A ${0.75 * pitch} ${0.75 * pitch} 0 0 1 ${
          circleCenter.x
        },${circleCenter.y}`}
        fill="none"
        stroke="black"
        strokeWidth={2}
      />
      <path
        d={`M ${circleCenter.x + 1.5 * pitch},${circleCenter.y} A ${0.75 * pitch} ${0.75 * pitch} 0 0 1 ${
          circleCenter.x
        },${circleCenter.y}`}
        fill="none"
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={circleCenter.x}
        y1={circleCenter.y - 2 * pitch}
        x2={circleCenter.x}
        y2={circleCenter.y - 2.5 * pitch}
        stroke="black"
        strokeWidth={2}
      />
      <line
        x1={circleCenter.x}
        y1={circleCenter.y + 2 * pitch}
        x2={circleCenter.x}
        y2={circleCenter.y + 2.5 * pitch}
        stroke="black"
        strokeWidth={2}
      />
    </svg>
  );
};

export default Signal;
