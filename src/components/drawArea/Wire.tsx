import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  edgeListAtom,
  logSelector,
  modeAtom,
  nodeListAtom,
  pitchAtom,
  previewWirePointsAtom,
  upperLeftAtom,
} from '../../atoms';
import { RealPoint, toFixedVirtualGrid, toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useWire } from '../../hooks/useWire';

const Wire: React.FC = () => {
  const pitch = useRecoilValue(pitchAtom);
  const mode = useRecoilValue(modeAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const [previewWirePoints, setPreviewWirePoints] = useRecoilState(previewWirePointsAtom);
  const edgeList = useRecoilValue(edgeListAtom);
  const { cutWire } = useWire();
  const setLogs = useSetRecoilState(logSelector);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const point1 = previewWirePoints.point1 && toRealGrid(previewWirePoints.point1, pitch, upperLeft);
  const point2 = previewWirePoints.point2 && toRealGrid(previewWirePoints.point2, pitch, upperLeft);

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
                    setLogs();
                    break;
                  case Mode.MOVE:
                    cutWire(id);
                    setLogs();
                    setCopyObjectType(Mode.WIRE);
                    setPreviewWirePoints({ point1: node1.point, point2: node2.point, prevCursorPoint: vpos });
                    break;
                  case Mode.COPY:
                    setCopyObjectType(Mode.WIRE);
                    setPreviewWirePoints({ point1: node1.point, point2: node2.point, prevCursorPoint: vpos });
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
