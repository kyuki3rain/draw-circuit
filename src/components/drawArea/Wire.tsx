import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  cursorPositionAtom,
  modeAtom,
  pitchAtom,
  previewWirePointsAtom,
  selectedNodeIdAtom,
  upperLeftAtom,
} from '../../atoms';
import { add, RealPoint, sub, toFixedVirtualGrid, toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useLog } from '../../states/logState';
import { useWire } from '../../hooks/useWire';
import { useEdge } from '../../states/edgeState';
import { useNode } from '../../states/nodeState';

const Wire: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const mode = useRecoilValue(modeAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { nodeList } = useNode();
  const [previewWirePoints, setPreviewWirePoints] = useRecoilState(previewWirePointsAtom);
  const { edgeList } = useEdge();
  const { cutWire } = useWire();
  const { setLog } = useLog();
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);
  const cursorPosition = useRecoilValue(cursorPositionAtom);
  const selectedNodeId = useRecoilValue(selectedNodeIdAtom);

  const vp1 =
    mode === Mode.WIRE
      ? selectedNodeId && nodeList.get(selectedNodeId)?.point
      : cursorPosition && previewWirePoints.point1Relative && add(previewWirePoints.point1Relative, cursorPosition);
  const vp2 =
    mode === Mode.WIRE
      ? cursorPosition
      : cursorPosition && previewWirePoints.point2Relative && add(previewWirePoints.point2Relative, cursorPosition);

  const point1 = vp1 && toRealGrid(vp1, pitch, upperLeft);
  const point2 = vp2 && toRealGrid(vp2, pitch, upperLeft);

  return (
    <svg>
      {Array.from(edgeList).map(([id, edge]) => {
        const node1 = nodeList.get(edge.node1);
        const node2 = nodeList.get(edge.node2);
        if (!node1 || !node2) return null;

        const a = toRealGrid(node1.point, pitch, upperLeft);
        const b = toRealGrid(node2.point, pitch, upperLeft);
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
                const vpos = toFixedVirtualGrid(pos, pitch, upperLeft);
                switch (mode) {
                  case Mode.CUT:
                    cutWire(id);
                    setLog();
                    break;
                  case Mode.MOVE:
                    cutWire(id);
                    setLog();
                    setCopyObjectType(Mode.WIRE);
                    setPreviewWirePoints({
                      point1Relative: sub(node1.point, vpos),
                      point2Relative: sub(node2.point, vpos),
                    });
                    break;
                  case Mode.COPY:
                    setCopyObjectType(Mode.WIRE);
                    setPreviewWirePoints({
                      point1Relative: sub(node1.point, vpos),
                      point2Relative: sub(node2.point, vpos),
                    });
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

export default Wire;
