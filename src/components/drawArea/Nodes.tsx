import { useNode } from '../../hooks/useNode';
import CircleNode from './Nodes/Circle';
import RectNode from './Nodes/Rect';

const Nodes: React.FC = () => {
  const { circleNodePointArray, rectNodePointArray, previewNodePoint } = useNode();

  return (
    <svg>
      {circleNodePointArray.map((point) => (
        <CircleNode point={point} key={`circle_node_${JSON.stringify(point)}`} />
      ))}
      {rectNodePointArray.map((point) => (
        <RectNode point={point} key={`rect_node_${JSON.stringify(point)}`} />
      ))}
      {previewNodePoint?.map((point) => (
        <RectNode point={point} key={`preview_node_${JSON.stringify(point)}`} />
      ))}
    </svg>
  );
};

export default Nodes;
