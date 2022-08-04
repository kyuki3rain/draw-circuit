import { ComponentType } from './componentHelper';
import { VirtualPoint } from './gridhelper';
import { NodeId } from './wireHelper';

export type SymbolState = {
  type: string;
  point: VirtualPoint;
  componentType: ComponentType;
  config: string;
  key: string;
  nodeIds: NodeId[];
};
