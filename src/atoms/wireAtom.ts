import { atom } from 'recoil';
import { NodeList, PointToNodeIdMap, EdgeList, NodeIdToEdgeIdMap } from '../helpers/wireHelper';

export const nodeListAtom = atom({
  key: 'nodeList',
  default: new Map() as NodeList,
});

export const pointToNodeIdAtom = atom({
  key: 'pointToNodeId',
  default: new Map() as PointToNodeIdMap,
});

export const edgeListAtom = atom({
  key: 'edgeList',
  default: new Map() as EdgeList,
});

export const nodeIdToEdgeIdAtom = atom({
  key: 'nodeIdToEdgeId',
  default: new Map() as NodeIdToEdgeIdMap,
});
