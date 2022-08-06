import { atom } from 'recoil';
import { VirtualPoint } from '../helpers/gridhelper';

export const positionAtom = atom({
  key: 'position',
  default: null as VirtualPoint | null,
});
