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
import { NodeId } from '../../helpers/wireHelper';
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
  const previewLabelName = useRecoilValue(previewLabelNameAtom);
  const previewLabelPosition = useRecoilValue(previewLabelPositionAtom);
  const nodeList = useRecoilValue(nodeListAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { removeLabel } = useLabel();

  const prp = previewLabelPosition && toRealGrid(previewLabelPosition, pitch, upperLeft);

  return (
    <svg>
      {Array.from(nodeIdToLabel.entries()).map(([nodeId, label]) => {
        const id = nodeId as NodeId;
        const node = nodeList.get(id);
        if (!node) return null;

        const rp = toRealGrid(node.point, pitch, upperLeft);
        return (
          <svg
            onClick={() => {
              removeLabel(id);
            }}
            key={`label_${id}`}
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
