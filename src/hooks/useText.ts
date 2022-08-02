import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { textsAtom, previewTextAtom, modeAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';

export const useText = () => {
  const [textStates, setTextStates] = useRecoilState(textsAtom);
  const [text, setPreviewText] = useRecoilState(previewTextAtom);
  const setMode = useSetRecoilState(modeAtom);

  const setText = useCallback(
    (point: VirtualPoint) => {
      setTextStates(textStates.concat([{ body: text, point }]));
      setPreviewText('');
      setMode(Mode.NONE);
    },
    [setMode, setPreviewText, setTextStates, text, textStates]
  );

  return { setText };
};

export default useText;
