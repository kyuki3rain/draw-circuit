import { atomFamily } from 'recoil';
import { builtinComponents } from '../helpers/componentHelper';

export const componentStateFamily = atomFamily({
  key: 'componentState',
  default: (params) => {
    const cn = params?.toString();
    if (cn) return builtinComponents(cn);
    return null;
  },
});
