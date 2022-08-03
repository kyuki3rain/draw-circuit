import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { textsAtom, previewTextAtom, modeAtom, TextState } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';

export const useText = () => {
  const [textStates, setTextStates] = useRecoilState(textsAtom);
  const [text, setPreviewText] = useRecoilState(previewTextAtom);
  const setMode = useSetRecoilState(modeAtom);

  const setText = useCallback(
    (point: VirtualPoint) => {
      if (!text) return;
      setTextStates(textStates.concat([{ ...text, point }]));
      setPreviewText(null);
      setMode(Mode.NONE);
    },
    [setMode, setPreviewText, setTextStates, text, textStates]
  );

  const removeText = useCallback(
    (state: TextState) => {
      setTextStates(textStates.filter((ts) => state.body !== ts.body || state.point !== ts.point));
    },
    [setTextStates, textStates]
  );

  return { setText, removeText };
};

export default useText;
