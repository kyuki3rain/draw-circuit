import { atom, atomFamily } from 'recoil';
import { ComponentType } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';

export const symbolsAtom = atom({
  key: 'symbols',
  default: new Map() as Map<ComponentType, SymbolState[]>,
});

export const symbolIdAtomFamily = atomFamily({
  key: 'symbolId',
  default: 1,
});
