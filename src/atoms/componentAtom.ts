import { atom, atomFamily } from 'recoil';
import { builtinComponentList, builtinComponents, ComponentName } from '../helpers/componentHelper';

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
