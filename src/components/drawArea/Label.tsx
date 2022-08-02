import { useRecoilValue } from 'recoil';
import {
  nodeIdToLabelAtom,
  nodeListAtom,
  pitchAtom,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  upperLeftAtom,
} from '../../atoms';
import { RealPoint, toRealGrid } from '../../helpers/gridhelper';

const createLabel = (rp: RealPoint, label: string, key: string, pitch: number) => {
  if (label === 'gnd') {
    return (
      <polyline
        points={`${rp.x + 1 * pitch}, ${rp.y} ${rp.x - 1 * pitch}, ${rp.y} ${rp.x}, ${rp.y + 1 * pitch} ${
          rp.x + 1 * pitch
        }, ${rp.y}`}
        stroke="black"
        strokeWidth={2}
        key={key}
        fill="none"
      />
    );
  }

  return (
    <text
      x={rp.x}
      y={rp.y}
      fontFamily="monospace, monospace"
      fontWeight="bold"
      fontSize="20"
      fontStyle="italic"
      key={key}
    >
      {label}
    </text>
  );
};

const Label: React.FC = () => {
  const nodeIdToLabel = useRecoilValue(nodeIdToLabelAtom);
  const previewLabelName = useRecoilValue(previewLabelNameAtom);
  const previewLabelPosition = useRecoilValue(previewLabelPositionAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);

  const prp = previewLabelPosition && toRealGrid(previewLabelPosition, pitch, upperLeft);

  return (
    <svg>
      {Array.from(nodeIdToLabel.entries()).map(([nodeId, label]) => {
        const node = nodeList.get(nodeId);
        if (!node) return null;

        const rp = toRealGrid(node.point, pitch, upperLeft);
        return createLabel(rp, label, `label_${nodeId}`, pitch);
      })}
      {prp && createLabel(prp, previewLabelName, `label_preview`, pitch)}
    </svg>
  );
};

export default Label;
