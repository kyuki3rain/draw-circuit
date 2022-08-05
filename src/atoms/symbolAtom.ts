import { atom, atomFamily } from 'recoil';
import { SymbolState } from '../helpers/symbolHelper';

export const symbolsAtom = atom({
  key: 'symbols',
  default: new Map() as Map<string, SymbolState[]>,
});

export const symbolIdAtomFamily = atomFamily({
  key: 'symbolId',
  default: 1,
});
