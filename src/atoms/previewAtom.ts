import { atom } from 'recoil';
import { SymbolState } from '../helpers/symbolHelper';

export const previewSymbolAtom = atom({
  key: 'previewSymbol',
  default: null as SymbolState | null,
});
