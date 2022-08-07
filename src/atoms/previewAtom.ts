import { atom, selector } from 'recoil';
import { Mode } from '../helpers/modehelper';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { componentNameAtom, copyObjectTypeAtom, modeAtom } from './statusAtom';
import { componentStateFamily } from './componentAtom';
import { SymbolState } from '../helpers/symbolHelper';
import { TextState } from './textAtom';
import { NodeId } from '../helpers/wireHelper';
import { cursorPositionAtom } from './positionAtom';

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

export const selectedNodeIdAtom = atom({
  key: 'selectedNodeId',
  default: null as NodeId | null,
});

export const previewWirePointsAtom = atom({
  key: 'previewWirePoints',
  default: {
    point1Relative: null as VirtualPoint | null,
    point2Relative: null as VirtualPoint | null,
  },
});

export const previewPositionSelector = selector({
  key: 'previewPosition',
  get: ({ get }) => {
    const componentName = get(componentNameAtom);
    const componentState = get(componentStateFamily(componentName));
    const cursorPosition = get(cursorPositionAtom);
    if (!cursorPosition) return null;

    switch (get(modeAtom)) {
      case Mode.SYMBOL:
        return componentState?.nodePoints.map((p) => add(p, cursorPosition));
      case Mode.LABEL:
        return [cursorPosition];
      case Mode.MOVE:
      case Mode.COPY:
        switch (get(copyObjectTypeAtom)) {
          case Mode.SYMBOL:
            return componentState?.nodePoints.map((p) => add(p, cursorPosition));
          case Mode.LABEL:
            return [cursorPosition];
          default:
            return null;
        }
      default:
        return null;
    }
  },
});
