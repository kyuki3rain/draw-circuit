import { RealPoint } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useEdge } from '../../states/edgeState';
import { useGridState } from '../../states/gridState';
import { useLog } from '../../states/logState';
import { useMode } from '../../states/modeState';
import { useNodeState } from '../../states/nodeState';
import { useWire, useWirePreviewWithNode, useWirePreviewWithoutNode } from '../../states/wireState';

const Wires: React.FC = () => {
  const { toRealPoint, toFixedVirtualPoint } = useGridState();
  const { mode, setCopyObjectType } = useMode();
  const { nodeList } = useNodeState();
  const { edgeList } = useEdge();
  const { cutWire } = useWire();
  const { setLog } = useLog();

  const { getWirePreviewWithNode } = useWirePreviewWithNode();
  const { getWirePreviewWithoutNode, initializeWirePreviewWithoutNode } = useWirePreviewWithoutNode();
  const [vp1, vp2] = mode === Mode.WIRE ? getWirePreviewWithNode() : getWirePreviewWithoutNode();
  const point1 = vp1 && toRealPoint(vp1);
  const point2 = vp2 && toRealPoint(vp2);

  return (
    <svg>
      {Array.from(edgeList).map(([id, edge]) => {
        const node1 = nodeList.get(edge.node1);
        const node2 = nodeList.get(edge.node2);
        if (!node1 || !node2) return null;

        const a = toRealPoint(node1.point);
        const b = toRealPoint(node2.point);
        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <svg key={`wire_${id}`}>
            <line x1={a.x} x2={b.x} y1={a.y} y2={b.y} stroke="black" strokeWidth={2} />
            <line
              x1={a.x}
              x2={b.x}
              y1={a.y}
              y2={b.y}
              strokeOpacity="0"
              stroke="black"
              strokeWidth={10}
              onClick={(e) => {
                const pos: RealPoint = { x: e.clientX, y: e.clientY };
                const vpos = toFixedVirtualPoint(pos);
                switch (mode) {
                  case Mode.CUT:
                    cutWire(id);
                    setLog();
                    break;
                  case Mode.MOVE:
                    cutWire(id);
                    setLog();
                    setCopyObjectType(Mode.WIRE);
                    initializeWirePreviewWithoutNode(node1.point, node2.point, vpos);
                    break;
                  case Mode.COPY:
                    setCopyObjectType(Mode.WIRE);
                    initializeWirePreviewWithoutNode(node1.point, node2.point, vpos);
                    break;
                  default:
                }
              }}
            />
          </svg>
        );
      })}
      {point1 && point2 ? (
        <line key="prev_wire" x1={point1.x} x2={point2.x} y1={point1.y} y2={point2.y} stroke="black" strokeWidth={2} />
      ) : null}
    </svg>
  );
};

export default Wires;