import { useRecoilValue, useSetRecoilState } from 'recoil';
import { copyObjectTypeAtom, modeAtom } from '../../atoms';
import { textsAtom, useText, useTextPreview } from '../../states/textState';
import { Mode } from '../../helpers/modehelper';
import { useLog } from '../../states/logState';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useGrid } from '../../states/gridState';

const Text: React.FC = () => {
  const { previewTextState, setTextPreview } = useTextPreview();
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const textStates = useRecoilValue(textsAtom);
  const { toRealGrid } = useGrid();
  const { removeText } = useText();
  const mode = useRecoilValue(modeAtom);
  const { setLog } = useLog();
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);
  const prp = cursorPosition && toRealGrid(cursorPosition);

  return (
    <svg>
      {textStates.map((textState) => {
        const rp = textState.point && toRealGrid(textState.point);
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
                  setTextPreview(textState.body, textState.isSpiceDirective);
                  setCursorPosition((prev) => textState.point ?? prev);
                  break;
                case Mode.COPY:
                  setCopyObjectType(Mode.TEXT);
                  setTextPreview(textState.body, textState.isSpiceDirective);
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
      {previewTextState && prp && (
        <text
          x={prp.x}
          y={prp.y}
          fontFamily="monospace, monospace"
          fontWeight="bold"
          fontSize="20"
          fontStyle="italic"
          key="label_preview"
          fill={previewTextState.isSpiceDirective ? 'black' : 'blue'}
        >
          {previewTextState.body}
        </text>
      )}
    </svg>
  );
};

export default Text;
