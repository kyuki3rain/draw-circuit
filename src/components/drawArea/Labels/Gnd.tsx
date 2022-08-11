import { add, VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';

type Props = {
  point: VirtualPoint;
};

const Gnd: React.FC<Props> = ({ point }) => {
  const { toRealPoint } = useGridState();

  const points = [
    add(point, { vx: 1, vy: 0 }),
    add(point, { vx: -1, vy: 0 }),
    add(point, { vx: 0, vy: 1 }),
    add(point, { vx: 1, vy: 0 }),
  ];
  const realPoints = points.map((p) => {
    const rp = toRealPoint(p);
    return [rp.x, rp.y];
  });

  return <polyline points={realPoints.flat().join(' ')} stroke="black" strokeWidth={2} fill="none" />;
};

export default Gnd;
