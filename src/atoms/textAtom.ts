import { atom } from 'recoil';
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
