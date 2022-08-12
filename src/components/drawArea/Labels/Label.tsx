import { VirtualPoint } from '../../../helpers/gridhelper';
import Gnd from './Gnd';
import Text from './Text';

type Props = {
  point: VirtualPoint;
  label: string;
};

const Label: React.FC<Props> = ({ point, label }) =>
  label === 'gnd' ? <Gnd point={point} /> : <Text point={point} text={label} />;

export default Label;
