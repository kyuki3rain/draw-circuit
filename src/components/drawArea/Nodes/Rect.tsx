import { VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';

type Props = {
  point: VirtualPoint;
};

const RectNode: React.FC<Props> = ({ point }) => {
  const { toRealPoint } = useGridState();
  const rp = toRealPoint(point);
  return <rect x={rp.x - 4} y={rp.y - 4} fill="white" stroke="black" strokeWidth={1} width={8} height={8} />;
};

export default RectNode;
