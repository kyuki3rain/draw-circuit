import { RealPoint } from '../../helpers/gridhelper';
import { usePreviewNodePosition } from '../../hooks/usePreview';
import { useEdge } from '../../states/edgeState';
import { useGrid } from '../../states/gridState';
import { useModal } from '../../states/modalState';
import { useNode } from '../../states/nodeState';

const createCircleNode = (rp: RealPoint, key: string) => (
  <circle cx={rp.x} cy={rp.y} fill="black" stroke="black" r={4} key={key} />
);

const createRectNode = (rp: RealPoint, key: string) => (
  <rect x={rp.x - 4} y={rp.y - 4} fill="white" stroke="black" strokeWidth={1} width={8} height={8} key={key} />
);

const Node: React.FC = () => {
  const { toRealGrid } = useGrid();
  const { nodeList } = useNode();
  const { getEdgeIdArray } = useEdge();
  const { previewNodePosition } = usePreviewNodePosition();
  const { open } = useModal();

  return (
    <svg>
      {Array.from(nodeList.values()).map((n) => {
        const edgeList = getEdgeIdArray(n.id);
        if ((edgeList?.length ?? 0) === 0) return createRectNode(toRealGrid(n.point), `node_${n.id}`);
        if (edgeList && edgeList.length >= 3) return createCircleNode(toRealGrid(n.point), `node_${n.id}`);
        return null;
      })}
      {!open &&
        previewNodePosition &&
        previewNodePosition.map((p) => p && createRectNode(toRealGrid(p), `node_preview_${JSON.stringify(p)}`))}
    </svg>
  );
};

export default Node;
