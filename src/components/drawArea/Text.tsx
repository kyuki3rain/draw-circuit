import { useRecoilValue } from 'recoil';

import { Mode } from '../../helpers/modehelper';
import { useCursorPosition } from '../../states/cursorPositionState';
import { useGridState } from '../../states/gridState';
import { useLog } from '../../states/logState';
import { useMode } from '../../states/modeState';
import { textsAtom, useText, useTextPreview } from '../../states/textState';

const Text: React.FC = () => {
  const { previewTextState, setTextPreview } = useTextPreview();
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const textStates = useRecoilValue(textsAtom);
  const { toRealPoint } = useGridState();
  const { removeText } = useText();
  const { mode, setCopyObjectType } = useMode();
  const { setLog } = useLog();
  const prp = cursorPosition && toRealPoint(cursorPosition);

  return (
    <svg>
      {textStates.map((textState) => {
        const rp = textState.point && toRealPoint(textState.point);
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
