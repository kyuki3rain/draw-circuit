import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { modeAtom, nodeListAtom, pitchAtom, previewPointAtom, selectedNodeIdAtom, upperLeftAtom } from '../../atoms';
import { toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useWire } from '../../hooks/useWire';

const Wire: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const mode = useRecoilValue(modeAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const selectedNodeId = useRecoilValue(selectedNodeIdAtom);
  const previewPoint = useRecoilValue(previewPointAtom);
  const { cutWire, edgeList } = useWire();
  const [update, setUpdate] = useState(false);

  const selectedNode = selectedNodeId && nodeList.get(selectedNodeId);
  const pa = selectedNode && toRealGrid(selectedNode.point, pitch, upperLeft);
  const pb = toRealGrid(previewPoint, pitch, upperLeft);

  return (
    <svg>
      {Array.from(edgeList).map(([id, edge]) => {
        const node1 = nodeList.get(edge.node1);
        const node2 = nodeList.get(edge.node2);
        if (!node1 || !node2) return null;

        const a = toRealGrid(node1.point, pitch, upperLeft);
        const b = toRealGrid(node2.point, pitch, upperLeft);
        return (
          <line
            key={`wire_${id}`}
            x1={a.x}
            x2={b.x}
            y1={a.y}
            y2={b.y}
            stroke="black"
            strokeWidth={2}
            onClick={() => {
              if (mode === Mode.CUT) {
                cutWire(id);
                setUpdate(!update);
              }
            }}
          />
        );
      })}
      {selectedNode ? (
        <line key="prev_wire" x1={pa?.x} x2={pb.x} y1={pa?.y} y2={pb.y} stroke="black" strokeWidth={2} />
      ) : null}
    </svg>
  );
};

export default Wire;
