import { useRecoilValue } from 'recoil';
import SVG from 'react-inlinesvg';
import { toRealGrid, VirtualPoint } from '../../helpers/gridhelper';
import { componentStateFamily } from '../../atoms';

type Props = {
  componentName: string;
  upperLeft: VirtualPoint;
  point: VirtualPoint;
  pitch: number;
};

const Symbol: React.FC<Props> = ({ componentName, upperLeft, point, pitch }) => {
  const center = toRealGrid(point, pitch, upperLeft);
  const componentState = useRecoilValue(componentStateFamily(componentName));
  if (!componentState) return null;
  return (
    <svg
      x={center.x - componentState.center.vx * pitch}
      y={center.y - componentState.center.vy * pitch}
      width={componentState.width * pitch}
      height={componentState.height * pitch}
    >
      <SVG src={componentState.svg} />
    </svg>
  );
};

export default Symbol;
