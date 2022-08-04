import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { textsAtom, previewTextAtom, TextState } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';

export const useText = () => {
  const [textStates, setTextStates] = useRecoilState(textsAtom);
  const [text] = useRecoilState(previewTextAtom);

  const setText = useCallback(
    (point: VirtualPoint) => {
      if (!text) return;
      setTextStates(textStates.concat([{ ...text, point }]));
    },
    [setTextStates, text, textStates]
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
