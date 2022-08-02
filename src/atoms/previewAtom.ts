import { atom, selector } from 'recoil';
import { Mode } from '../helpers/modehelper';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { modeAtom } from './statusAtom';
import { componentStateFamily } from './componentAtom';
import { SymbolState } from '../helpers/symbolHelper';
import { NodeId } from './wireAtom';

export const previewLabelNameAtom = atom({
  key: 'previewLabelName',
  default: '',
});
export const previewLabelPositionAtom = atom({
  key: 'previewLabelPosition',
  default: null as VirtualPoint | null,
});

export const previewSymbolAtom = atom({
  key: 'previewSymbol',
  default: null as SymbolState | null,
});

export const selectedNodeIdAtom = atom({
  key: 'selectedNodeId',
  default: null as NodeId | null,
});

export const previewPointAtom = atom({
  key: 'previewPoint',
  default: {} as VirtualPoint,
});

export const previewPositionSelector = selector({
  key: 'previewPosition',
  get: ({ get }) => {
    const symbol = get(previewSymbolAtom);
    const componentState = get(componentStateFamily(symbol?.type));

    switch (get(modeAtom)) {
      case Mode.SYMBOL:
        if (symbol === null) return null;
        return componentState?.nodes.map((p) => add(p, symbol.point));
      case Mode.LABEL:
        return [get(previewLabelPositionAtom)];
      default:
        return null;
    }
  },
});
