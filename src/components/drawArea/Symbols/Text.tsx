import { RealPoint } from '../../../helpers/gridhelper';

type Props = {
  position: RealPoint;
  text: string;
};

const Text: React.FC<Props> = ({ position, text }) => (
  <text
    x={position.x}
    y={position.y}
    fontFamily="monospace, monospace"
    fontWeight="bold"
    fontSize="20"
    fontStyle="italic"
  >
    {text}
  </text>
);

export default Text;
