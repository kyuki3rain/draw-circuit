import { useRecoilValue, useSetRecoilState } from 'recoil';
import { copyObjectTypeAtom, modeAtom, pitchAtom, upperLeftAtom } from '../../atoms';
import { RealPoint, toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useIsolatedNode } from '../../hooks/useIsoratedNode';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useLabel, useLabelPreview } from '../../states/labelState';
import { useLog } from '../../states/logState';
import { useNode } from '../../states/nodeState';

const createLabel = (rp: RealPoint, label: string, pitch: number) => {
  if (label === 'gnd') {
    return (
      <polyline
        points={`${rp.x + 1 * pitch}, ${rp.y} ${rp.x - 1 * pitch}, ${rp.y} ${rp.x}, ${rp.y + 1 * pitch} ${
          rp.x + 1 * pitch
        }, ${rp.y}`}
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
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { labelList, deleteLabel } = useLabel();
  const { getLabelPreview, setLabelPreview } = useLabelPreview();
  const { isIsolatedNode } = useIsolatedNode();
  const { removeNode } = useNode();
  const mode = useRecoilValue(modeAtom);
  const { setLog } = useLog();
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const prp = cursorPosition && toRealGrid(cursorPosition, pitch, upperLeft);

  return (
    <svg>
      {Array.from(labelList.entries()).map(([nodeId, label]) => {
        const node = nodeList.get(nodeId);
        if (!node) return null;

        const rp = toRealGrid(node.point, pitch, upperLeft);
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
            {createLabel(rp, label, pitch)}
          </svg>
        );
      })}
      {prp && createLabel(prp, getLabelPreview() ?? '', pitch)}
    </svg>
  );
};

export default Label;
