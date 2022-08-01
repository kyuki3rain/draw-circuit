import { VirtualPoint } from './gridhelper';

export type SymbolState = {
  type: string;
  point: VirtualPoint;
  config: string;
  key: string;
};

export const nextType = (cn: string) => {
  switch (cn) {
    case 'cell':
      return 'signal';
    case 'signal':
      return 'nmos4';
    case 'nmos4':
      return 'pmos4';
    case 'pmos4':
      return 'cell';
    default:
      return '';
  }
};
