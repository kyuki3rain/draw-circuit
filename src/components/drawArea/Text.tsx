import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  logSelector,
  modeAtom,
  pitchAtom,
  previewTextAtom,
  previewTextPositionAtom,
  upperLeftAtom,
} from '../../atoms';
import { textsAtom } from '../../atoms/textAtom';
import { toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useText } from '../../hooks/useText';

const Text: React.FC = () => {
  const [previewText, setPreviewText] = useRecoilState(previewTextAtom);
  const [previewTextPoint, setPreviewTextPosition] = useRecoilState(previewTextPositionAtom);
  const textStates = useRecoilValue(textsAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { removeText } = useText();
  const mode = useRecoilValue(modeAtom);
  const setLogs = useSetRecoilState(logSelector);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

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
            onClick={() => {
              switch (mode) {
                case Mode.CUT:
                  removeText(textState);
                  setLogs();
                  break;
                case Mode.MOVE:
                  removeText(textState);
                  setLogs();
                  setCopyObjectType(Mode.TEXT);
                  setPreviewText({ body: textState.body, isSpiceDirective: textState.isSpiceDirective });
                  setPreviewTextPosition(null);
                  break;
                case Mode.COPY:
                  setCopyObjectType(Mode.TEXT);
                  setPreviewText({ body: textState.body, isSpiceDirective: textState.isSpiceDirective });
                  setPreviewTextPosition(null);
                  break;
                default:
              }
            }}
          >
            {textState.body}
          </text>
        );
      })}
      {previewText && prp && (
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
