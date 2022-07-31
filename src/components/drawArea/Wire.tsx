import { useRecoilValue } from 'recoil';
import {
  edgeListAtom,
  nodeListAtom,
  pitchAtom,
  previewPointAtom,
  selectedNodeIdAtom,
  upperLeftAtom,
} from '../../atoms';
import { RealPoint, toRealGrid } from '../../helpers/gridhelper';

export const createLine = (a: RealPoint, b: RealPoint, key: string) => (
  <line key={key} x1={a.x} x2={b.x} y1={a.y} y2={b.y} stroke="black" strokeWidth={2} />
);

const Wire: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const edgeList = useRecoilValue(edgeListAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const selectedNodeId = useRecoilValue(selectedNodeIdAtom);
  const previewPoint = useRecoilValue(previewPointAtom);

  const selectedNode = selectedNodeId && nodeList.get(selectedNodeId);

  return (
    <svg>
      {Array.from(edgeList).map(([id, edge]) => {
        const node1 = nodeList.get(edge.node1);
        const node2 = nodeList.get(edge.node2);
        if (!node1 || !node2) return null;

        return createLine(
          toRealGrid(node1.point, pitch, upperLeft),
          toRealGrid(node2.point, pitch, upperLeft),
          `wire_${id}`
        );
      })}
      {selectedNode
        ? createLine(
            toRealGrid(selectedNode.point, pitch, upperLeft),
            toRealGrid(previewPoint, pitch, upperLeft),
            'prev_wire'
          )
        : null}
    </svg>
  );
};

export default Wire;
