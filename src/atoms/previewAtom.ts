import { selector } from 'recoil';
import { Mode } from '../helpers/modehelper';
import { add } from '../helpers/gridhelper';
import { previewSymbolAtom } from './symbolAtom';
import { modeAtom } from './statusAtom';
import { previewLabelPositionAtom } from './labelAtom';
import { componentStateFamily } from './componentAtom';

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
