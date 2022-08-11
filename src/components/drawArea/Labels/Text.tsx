import { VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';

type Props = {
  point: VirtualPoint;
  text: string;
};

const Text: React.FC<Props> = ({ point, text }) => {
  const { toRealPoint } = useGridState();
  const rp = toRealPoint(point);

  return (
    <text x={rp.x} y={rp.y} fontFamily="monospace, monospace" fontWeight="bold" fontSize="20" fontStyle="italic">
      {text}
    </text>
  );
};

export default Text;
