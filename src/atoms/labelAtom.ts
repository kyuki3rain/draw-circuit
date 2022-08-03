import { atom } from 'recoil';
import { NodeId } from '../helpers/wireHelper';

export const nodeIdToLabelAtom = atom({
  key: 'nodeIdToLabel',
  default: new Map() as Map<NodeId, string>,
});
