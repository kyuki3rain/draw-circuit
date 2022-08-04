import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  logSelector,
  modeAtom,
  nodeIdToLabelAtom,
  nodeListAtom,
  pitchAtom,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  upperLeftAtom,
} from '../../atoms';
import { RealPoint, toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useLabel } from '../../hooks/useLabel';

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
  const nodeIdToLabel = useRecoilValue(nodeIdToLabelAtom);
  const [previewLabelName, setLabelName] = useRecoilState(previewLabelNameAtom);
  const [previewLabelPosition, setPreviewLabelPoision] = useRecoilState(previewLabelPositionAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { removeLabel } = useLabel();
  const mode = useRecoilValue(modeAtom);
  const setLogs = useSetRecoilState(logSelector);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const prp = previewLabelPosition && toRealGrid(previewLabelPosition, pitch, upperLeft);

  return (
    <svg>
      {Array.from(nodeIdToLabel.entries()).map(([nodeId, label]) => {
        const node = nodeList.get(nodeId);
        if (!node) return null;

        const rp = toRealGrid(node.point, pitch, upperLeft);
        return (
          <svg
            onClick={() => {
              switch (mode) {
                case Mode.CUT:
                  removeLabel(nodeId);
                  setLogs();
                  break;
                case Mode.COPY:
                  setCopyObjectType(Mode.LABEL);
                  setLabelName(label);
                  setPreviewLabelPoision(node.point);
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
      {prp && createLabel(prp, previewLabelName, pitch)}
    </svg>
  );
};

export default Label;
