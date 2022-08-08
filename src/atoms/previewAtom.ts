import { atom } from 'recoil';
import { SymbolState } from '../helpers/symbolHelper';
import { TextState } from './textAtom';

export const previewLabelNameAtom = atom({
  key: 'previewLabelName',
  default: '',
});

export const previewTextAtom = atom({
  key: 'previewText',
  default: null as TextState | null,
});

export const previewSymbolAtom = atom({
  key: 'previewSymbol',
  default: null as SymbolState | null,
});
