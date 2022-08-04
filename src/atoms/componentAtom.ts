import { atom, atomFamily } from 'recoil';
import { builtinComponentList, builtinComponents } from '../helpers/componentHelper';

export const componentListAtom = atom({
  key: 'componentList',
  default: builtinComponentList,
});

export const componentStateFamily = atomFamily({
  key: 'componentState',
  default: (params) => {
    const cn = params?.toString();
    if (cn) return builtinComponents(cn);
    return null;
  },
});
