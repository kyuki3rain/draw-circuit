import { useGridState } from '../states/gridState';
import { useWindowSize } from './useWindowSize';

export const useGrid = () => {
  const { height, width } = useWindowSize();
  const { getGridArray, toRealGrid, correction } = useGridState();

  const XGridArray = getGridArray(width).map((_, i) => ({
    x1: toRealGrid(i + correction.vertical),
    x2: toRealGrid(i + correction.vertical),
    y1: 0,
    y2: height,
    key: `vertical_grid_${i}`,
  }));
  const YGridArray = getGridArray(height).map((_, i) => ({
    x1: 0,
    x2: width,
    y1: toRealGrid(i + correction.horizontal),
    y2: toRealGrid(i + correction.horizontal),
    key: `vertical_grid_${i}`,
  }));

  return {
    XGridArray,
    YGridArray,
  };
};
