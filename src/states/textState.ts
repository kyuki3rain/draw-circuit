import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';
import { VirtualPoint } from '../helpers/gridhelper';

export type TextState = {
  body: string;
  point?: VirtualPoint;
  isSpiceDirective: boolean;
};

export const textsAtom = atom({
  key: 'texts',
  default: [] as TextState[],
});

export const previewTextAtom = atom({
  key: 'previewText',
  default: null as TextState | null,
});

export const useText = () => {
  const [textStates, setTextStates] = useRecoilState(textsAtom);
  const [text] = useRecoilState(previewTextAtom);

  const getSpiceDirectives = useCallback(
    () => textStates.filter((ts) => ts.isSpiceDirective).map((t) => t.body),
    [textStates]
  );
  const getComments = useCallback(
    () => textStates.filter((ts) => !ts.isSpiceDirective).map((t) => t.body),
    [textStates]
  );

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

  return { setText, removeText, getSpiceDirectives, getComments };
};

export const useTextPreview = () => {
  const [textState, setTextState] = useRecoilState(previewTextAtom);

  const getTextPreview = useCallback(() => textState, [textState]);
  const resetTextPreview = useCallback(() => setTextState(null), [setTextState]);
  const initializeTextPreview = useCallback(() => resetTextPreview(), [resetTextPreview]);
  const setTextPreview = useCallback(
    (text: string, isSpiceDirective?: boolean) => {
      setTextState((prev) => ({ body: text, isSpiceDirective: isSpiceDirective ?? prev?.isSpiceDirective ?? false }));
    },
    [setTextState]
  );

  return {
    previewTextState: textState,
    getTextPreview,
    resetTextPreview,
    initializeTextPreview,
    setTextPreview,
  };
};

export const useTextView = () => {
  const [textStates, setTextStates] = useRecoilState(textsAtom);

  return {
    getTextView: useCallback(() => ({ textStates }), [textStates]),
    setTextView: useCallback(
      ({ textStates: newTextStates }: { textStates: TextState[] }) => setTextStates(newTextStates),
      [setTextStates]
    ),
  };
};
