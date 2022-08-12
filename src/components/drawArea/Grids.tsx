import { useGrid } from '../../hooks/useGrid';

const Grids: React.FC = () => {
  const { XGridArray, YGridArray } = useGrid();

  return (
    <svg>
      {XGridArray.map((g) => (
        <line key={g.key} x1={g.x1} x2={g.x2} y1={g.y1} y2={g.y2} stroke="lightgray" strokeWidth={1} />
      ))}
      {YGridArray.map((g) => (
        <line key={g.key} x1={g.x1} x2={g.x2} y1={g.y1} y2={g.y2} stroke="lightgray" strokeWidth={1} />
      ))}
    </svg>
  );
};

export default Grids;
