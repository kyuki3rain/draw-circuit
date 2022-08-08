import { atom, atomFamily, selector } from 'recoil';
import { builtinComponentList, builtinComponents, ComponentName } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';

export const componentListAtom = atom({
  key: 'componentList',
  default: builtinComponentList,
});

export const componentStateFamily = atomFamily({
  key: 'componentState',
  default: (componentName?: ComponentName) => {
    if (componentName) return builtinComponents(componentName);
    return null;
  },
});

export const componentNodePointSelector = selector({
  key: 'componentNodePoint',
  get:
    ({ get }) =>
    (s: SymbolState) =>
      get(componentStateFamily(s.componentName))?.nodePoints,
});
