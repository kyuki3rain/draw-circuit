import { ComponentType } from './componentHelper';
import { VirtualPoint } from './gridhelper';
import { NodeId } from './wireHelper';

export type SymbolState = {
  type: string;
  point: VirtualPoint;
  componentType: ComponentType;
  config: string;
  key: string;
  nodes: NodeId[];
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
