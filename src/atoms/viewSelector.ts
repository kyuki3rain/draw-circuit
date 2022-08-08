import { atom } from 'recoil';
import { ViewState } from '../hooks/useView';

export const logsAtom = atom({
  key: 'logs',
  default: [] as ViewState[],
});

export const logIndexAtom = atom({
  key: 'logIndex',
  default: 0,
});
