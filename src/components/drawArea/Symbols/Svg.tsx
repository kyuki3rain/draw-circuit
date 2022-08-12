import SVG from 'react-inlinesvg';

import { VirtualPoint } from '../../../helpers/gridhelper';
import { useGridState } from '../../../states/gridState';

type Props = {
  upperLeft: VirtualPoint;
  width: number;
  height: number;
  svg: string;
};

const Svg: React.FC<Props> = ({ upperLeft, width, height, svg }) => {
  const { toRealGrid, toRealPoint } = useGridState();
  const realUL = toRealPoint(upperLeft);
  const realW = toRealGrid(width);
  const realH = toRealGrid(height);

  return (
    <svg x={realUL.x} y={realUL.y} width={realW} height={realH}>
      <SVG src={svg} />
    </svg>
  );
};

export default Svg;
