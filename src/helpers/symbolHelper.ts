import { ComponentName, ComponentType } from './componentHelper';
import { VirtualPoint } from './gridhelper';
import { NodeId } from './wireHelper';

export type SymbolState = {
  componentName: ComponentName;
  componentType: ComponentType;
  point: VirtualPoint;
  value: string;
  modelName: string;
  config: { key: string; value: string; name: string }[];
  key: string;
  nodeIds: NodeId[];
};

export const getConfig = (s: SymbolState) => {
  let res = [];
  if (s.value) res.push(s.value);
  if (s.modelName) res.push(s.modelName);
  if (s.config) res = res.concat(s.config.map((c) => `${c.key}=${c.value}`));
  return res.join(' ');
};
