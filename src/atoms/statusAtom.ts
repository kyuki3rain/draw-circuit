import { atom, selector } from 'recoil';
import { Mode, ModeType } from '../helpers/modehelper';
import { nextType } from '../helpers/symbolHelper';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const symbolTypeAtom = atom({
  key: 'symbolType',
  default: 'cell',
});

export const labelModalAtom = atom({
  key: 'labelModal',
  default: false,
});

export const modeSelector = selector({
  key: 'mode/sel',
  get: ({ get }) => get(modeAtom),
  set: ({ set, get }, value) => {
    switch (value) {
      case Mode.SYMBOL:
        set(symbolTypeAtom, nextType(get(symbolTypeAtom)));
        break;
      default:
    }

    set(modeAtom, value);
  },
});

export const nextSymbolTypeSelector = selector({
  key: 'nextSymbolType',
  get: ({ get }) => nextType(get(symbolTypeAtom)),
  set: ({ set, get }) => set(symbolTypeAtom, nextType(get(symbolTypeAtom))),
});
