import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { textsAtom, previewTextAtom, TextState } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';

export const useText = () => {
  const setTextStates = useSetRecoilState(textsAtom);
  const [text] = useRecoilState(previewTextAtom);

  const setText = useCallback(
    (point: VirtualPoint) => {
      if (!text) return;
      setTextStates((prev) => prev.concat([{ ...text, point }]));
    },
    [setTextStates, text]
  );

  const removeText = useCallback(
    (state: TextState) => {
      setTextStates((prev) => prev.filter((ts) => state.body !== ts.body || state.point !== ts.point));
    },
    [setTextStates]
  );

  return { setText, removeText };
};

export default useText;
