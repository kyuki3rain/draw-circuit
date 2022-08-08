import { useRecoilValue } from 'recoil';
import { labelModalAtom, pitchAtom, selectedNodeIdAtom, upperLeftAtom } from '../../atoms';
import { previewPositionSelector } from '../../atoms/previewAtom';
import { toRealGrid, VirtualPoint } from '../../helpers/gridhelper';
import { useEdge } from '../../states/edgeState';
import { useNode } from '../../states/nodeState';

const createCircleNode = (point: VirtualPoint, pitch: number, upperLeft: VirtualPoint, key: string) => {
  const rp = toRealGrid(point, pitch, upperLeft);
  return <circle cx={rp.x} cy={rp.y} fill="black" stroke="black" r={4} key={key} />;
};

const createRectNode = (point: VirtualPoint, pitch: number, upperLeft: VirtualPoint, key: string) => {
  const rp = toRealGrid(point, pitch, upperLeft);
  return <rect x={rp.x - 4} y={rp.y - 4} fill="white" stroke="black" strokeWidth={1} width={8} height={8} key={key} />;
};

const Node: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { nodeList } = useNode();
  const { getEdgeIdArray } = useEdge();
  const previewPosition = useRecoilValue(previewPositionSelector);
  const labelModal = useRecoilValue(labelModalAtom);
  const selectedNodeId = useRecoilValue(selectedNodeIdAtom);

  return (
    <svg>
      {Array.from(nodeList.values()).map((n) => {
        const edgeList = getEdgeIdArray(n.id);
        if (selectedNodeId === n.id) {
          if (edgeList && edgeList.length >= 3) return createCircleNode(n.point, pitch, upperLeft, `node_${n.id}`);
          return null;
        }

        if ((edgeList?.length ?? 0) === 0) return createRectNode(n.point, pitch, upperLeft, `node_${n.id}`);
        if (edgeList && edgeList.length >= 3) return createCircleNode(n.point, pitch, upperLeft, `node_${n.id}`);
        return null;
      })}
      {!labelModal &&
        previewPosition &&
        previewPosition.map((p) => p && createRectNode(p, pitch, upperLeft, `node_preview_${JSON.stringify(p)}`))}
    </svg>
  );
};

export default Node;
