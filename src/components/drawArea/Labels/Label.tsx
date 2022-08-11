import { VirtualPoint } from '../../../helpers/gridhelper';
import Text from '../../common/Text';
import Gnd from './Gnd';

type Props = {
  point: VirtualPoint;
  label: string;
};

const Label: React.FC<Props> = ({ point, label }) =>
  label === 'gnd' ? <Gnd point={point} /> : <Text point={point} text={label} />;

export default Label;
