import { atom } from 'recoil';
import { SymbolState } from '../helpers/symbolHelper';

export const symbolsAtom = atom({
  key: 'symbols',
  default: new Map() as Map<string, SymbolState[]>,
});
