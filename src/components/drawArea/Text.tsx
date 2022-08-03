import { useRecoilValue } from 'recoil';
import { pitchAtom, previewTextAtom, previewTextPositionAtom, textModalAtom, upperLeftAtom } from '../../atoms';
import { textsAtom } from '../../atoms/textAtom';
import { toRealGrid } from '../../helpers/gridhelper';
import { useText } from '../../hooks/useText';

const Text: React.FC = () => {
  const previewText = useRecoilValue(previewTextAtom);
  const previewTextPoint = useRecoilValue(previewTextPositionAtom);
  const open = useRecoilValue(textModalAtom);
  const textStates = useRecoilValue(textsAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { removeText } = useText();

  const prp = previewTextPoint && toRealGrid(previewTextPoint, pitch, upperLeft);

  return (
    <svg>
      {textStates.map((textState) => {
        const rp = textState.point && toRealGrid(textState.point, pitch, upperLeft);
        return (
          <text
            x={rp?.x}
            y={rp?.y}
            fontFamily="monospace, monospace"
            fontWeight="bold"
            fontSize="20"
            fontStyle="italic"
            key={`label_${JSON.stringify(textState)}`}
            fill={textState.isSpiceDirective ? 'black' : 'blue'}
            onClick={() => removeText(textState)}
          >
            {textState.body}
          </text>
        );
      })}
      {!open && previewText && prp && (
        <text
          x={prp.x}
          y={prp.y}
          fontFamily="monospace, monospace"
          fontWeight="bold"
          fontSize="20"
          fontStyle="italic"
          key="label_preview"
          fill={previewText.isSpiceDirective ? 'black' : 'blue'}
        >
          {previewText.body}
        </text>
      )}
    </svg>
  );
};

export default Text;
