import { atom } from 'recoil';
import { Mode, ModeType } from '../helpers/modehelper';

export const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

export const copyObjectTypeAtom = atom({
  key: 'copyObjectType',
  default: Mode.NONE as ModeType,
});
