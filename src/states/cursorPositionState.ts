import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';

const cursorPositionAtom = atom({
  key: 'cursorPosition',
  default: null as VirtualPoint | null,
});

export const useCursorPosition = () => {
  const [cursorPosition, setCursorPosition] = useRecoilState(cursorPositionAtom);
  return { cursorPosition, getCursorPosition: useCallback(() => cursorPosition, [cursorPosition]), setCursorPosition };
};
