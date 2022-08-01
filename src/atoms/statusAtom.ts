import { atom, selector } from 'recoil';
import { Mode, ModeType } from '../helpers/modehelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from './wireAtom';
import { nextType } from '../helpers/symbolHelper';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const symbolTypeAtom = atom({
  key: 'symbolType',
  default: 'cell',
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

export const selectedNodeIdAtom = atom({
  key: 'selectedNodeId',
  default: null as NodeId | null,
});

export const previewPointAtom = atom({
  key: 'previewPoint',
  default: {} as VirtualPoint,
});
