import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  modeAtom,
  pitchAtom,
  cursorPositionAtom,
  previewTextAtom,
  upperLeftAtom,
} from '../../atoms';
import { textsAtom } from '../../atoms/textAtom';
import { toRealGrid } from '../../helpers/gridhelper';
import { Mode } from '../../helpers/modehelper';
import { useLog } from '../../hooks/useLog';
import { useText } from '../../hooks/useText';

const Text: React.FC = () => {
  const [previewText, setPreviewText] = useRecoilState(previewTextAtom);
  const [cursorPosition, setCursorPosition] = useRecoilState(cursorPositionAtom);
  const textStates = useRecoilValue(textsAtom);
  const pitch = useRecoilValue(pitchAtom);
  const upperLeft = useRecoilValue(upperLeftAtom);
  const { removeText } = useText();
  const mode = useRecoilValue(modeAtom);
  const { setLog } = useLog();
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const prp = cursorPosition && toRealGrid(cursorPosition, pitch, upperLeft);

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
                  setLog();
                  break;
                case Mode.MOVE:
                  removeText(textState);
                  setLog();
                  setCopyObjectType(Mode.TEXT);
                  setPreviewText({ body: textState.body, isSpiceDirective: textState.isSpiceDirective });
                  setCursorPosition((prev) => textState.point ?? prev);
                  break;
                case Mode.COPY:
                  setCopyObjectType(Mode.TEXT);
                  setPreviewText({ body: textState.body, isSpiceDirective: textState.isSpiceDirective });
                  setCursorPosition((prev) => textState.point ?? prev);
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
