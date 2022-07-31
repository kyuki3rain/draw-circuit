import { useRecoilValue } from 'recoil';
import { pitchAtom, upperLeftAtom } from '../../atoms';
import { useWindowSize } from '../../hooks/useWindowSize';

const Grid: React.FC = () => {
  const { height, width } = useWindowSize();
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);

  const verticalCorrection = Math.ceil(upperLeft.vx) - upperLeft.vx;
  const horizontalCorrection = Math.ceil(upperLeft.vy) - upperLeft.vy;

  return (
    <svg>
      {[...(Array(Math.ceil(width / pitch)) as number[])].map((_, i) => (
        <line
          key={`vertical_grid_${(i + verticalCorrection) * pitch}`}
          x1={(i + verticalCorrection) * pitch}
          x2={(i + verticalCorrection) * pitch}
          y1={0}
          y2={height}
          stroke="lightgray"
          strokeWidth={1}
        />
      ))}
      {[...(Array(Math.floor(height / pitch)) as number[])].map((_, i) => (
        <line
          key={`vertical_grid_${(i + horizontalCorrection) * pitch}`}
          x1={0}
          x2={width}
          y1={(i + horizontalCorrection) * pitch}
          y2={(i + horizontalCorrection) * pitch}
          stroke="lightgray"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};

export default Grid;
