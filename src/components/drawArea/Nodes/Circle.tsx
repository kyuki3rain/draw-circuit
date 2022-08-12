import { VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';

type Props = {
  point: VirtualPoint;
};

const CircleNode: React.FC<Props> = ({ point }) => {
  const { toRealPoint } = useGridState();
  const rp = toRealPoint(point);
  return <circle cx={rp.x} cy={rp.y} fill="black" stroke="black" r={4} />;
};

export default CircleNode;
