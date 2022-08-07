import { atom } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';

export const cursorPositionAtom = atom({
  key: 'cursorPosition',
  default: null as VirtualPoint | null,
});
