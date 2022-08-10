import { useWindowSize } from '../../hooks/useWindowSize';
import { useGrid } from '../../states/gridState';

const Grid: React.FC = () => {
  const { height, width } = useWindowSize();
  const { getGridArray, toRealLength, verticalCorrection, horizontalCorrection } = useGrid();

  return (
    <svg>
      {getGridArray(width).map((_, i) => (
        <line
          key={`vertical_grid_${toRealLength(i + verticalCorrection)}`}
          x1={toRealLength(i + verticalCorrection)}
          x2={toRealLength(i + verticalCorrection)}
          y1={0}
          y2={height}
          stroke="lightgray"
          strokeWidth={1}
        />
      ))}
      {getGridArray(height).map((_, i) => (
        <line
          key={`vertical_grid_${toRealLength(i + horizontalCorrection)}`}
          x1={0}
          x2={width}
          y1={toRealLength(i + horizontalCorrection)}
          y2={toRealLength(i + horizontalCorrection)}
          stroke="lightgray"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};

export default Grid;
