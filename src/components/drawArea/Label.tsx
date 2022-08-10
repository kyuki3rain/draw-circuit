import { useRecoilValue, useSetRecoilState } from 'recoil';
import { copyObjectTypeAtom, modeAtom } from '../../atoms';
import { RealPoint } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useIsolatedNode } from '../../hooks/useIsoratedNode';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useGrid } from '../../states/gridState';
import { useLabel, useLabelPreview } from '../../states/labelState';
import { useLog } from '../../states/logState';
import { useNode } from '../../states/nodeState';

const createLabel = (rp: RealPoint, label: string, toRealLength: (realLength: number) => number) => {
  if (label === 'gnd') {
    return (
      <polyline
        points={`${rp.x + toRealLength(1)}, ${rp.y} ${rp.x - toRealLength(1)}, ${rp.y} ${rp.x}, ${
          rp.y + toRealLength(1)
        } ${rp.x + toRealLength(1)}, ${rp.y}`}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    );
  }

  return (
    <text x={rp.x} y={rp.y} fontFamily="monospace, monospace" fontWeight="bold" fontSize="20" fontStyle="italic">
      {label}
    </text>
  );
};

const Label: React.FC = () => {
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const { nodeList } = useNode();
  const { toRealGrid, toRealLength } = useGrid();
  const { labelList, deleteLabel } = useLabel();
  const { getLabelPreview, setLabelPreview } = useLabelPreview();
  const { isIsolatedNode } = useIsolatedNode();
  const { removeNode } = useNode();
  const mode = useRecoilValue(modeAtom);
  const { setLog } = useLog();
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const prp = cursorPosition && toRealGrid(cursorPosition);

  return (
    <svg>
      {Array.from(labelList.entries()).map(([nodeId, label]) => {
        const node = nodeList.get(nodeId);
        if (!node) return null;

        const rp = toRealGrid(node.point);
        return (
          <svg
            onClick={() => {
              switch (mode) {
                case Mode.CUT:
                  deleteLabel(nodeId);
                  if (isIsolatedNode(nodeId)) removeNode(nodeId);

                  setLog();
                  break;
                case Mode.MOVE:
                  deleteLabel(nodeId);
                  if (isIsolatedNode(nodeId)) removeNode(nodeId);

                  setLog();
                  setCopyObjectType(Mode.LABEL);
                  setLabelPreview(label);
                  setCursorPosition(node.point);
                  break;
                case Mode.COPY:
                  setCopyObjectType(Mode.LABEL);
                  setLabelPreview(label);
                  setCursorPosition(node.point);
                  break;
                default:
              }
            }}
            key={`label_${nodeId}`}
          >
            {createLabel(rp, label, toRealLength)}
          </svg>
        );
      })}
      {prp && createLabel(prp, getLabelPreview() ?? '', toRealLength)}
    </svg>
  );
};

export default Label;
