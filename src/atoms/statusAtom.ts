import { atom, selector } from 'recoil';
import { Mode, ModeType } from '../helpers/modehelper';
import { SymbolState } from '../helpers/symbolHelper';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const copyObjectTypeAtom = atom({
  key: 'copyObjectType',
  default: Mode.NONE as ModeType,
});

export const symbolTypeAtom = atom({
  key: 'symbolType',
  default: '',
});

export const labelModalAtom = atom({
  key: 'labelModal',
  default: false,
});
export const textModalAtom = atom({
  key: 'textModal',
  default: false,
});

export const selectSymbolModalAtom = atom({
  key: 'selectSymbolModal',
  default: false,
});

export const symbolConfigModalAtom = atom({
  key: 'SymbolConfigModal',
  default: false,
});

export const modalSelector = selector({
  key: 'modal',
  get: ({ get }) =>
    get(labelModalAtom) || get(textModalAtom) || get(selectSymbolModalAtom) || get(symbolConfigModalAtom),
});

export const symbolConfigAtom = atom({
  key: 'SymbolConfig',
  default: null as SymbolState | null,
});
