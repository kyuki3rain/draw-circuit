import { VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';
import Text from './Text';

type Props = {
  upperLeft: VirtualPoint;
  width: number;
  height: number;
  key: string;
  config: string;
};

const ConfigText: React.FC<Props> = ({ upperLeft, width, height, key, config }) => {
  const { toRealGrid, toRealPoint } = useGridState();
  const realUL = toRealPoint(upperLeft);
  const realW = toRealGrid(width);
  const realH = toRealGrid(height);
  return (
    <>
      <Text
        position={{
          x: realUL.x + realW + 20,
          y: realUL.y + 20,
        }}
        text={key}
      />
      <Text
        position={{
          x: realUL.x + realW + 20,
          y: realUL.y + realH,
        }}
        text={config}
      />
    </>
  );
};

export default ConfigText;
