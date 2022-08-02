import { atom, DefaultValue, selector } from 'recoil';
import { clone } from '../helpers/cloneHelper';
import { SymbolState } from '../helpers/symbolHelper';
import { nodeIdToLabelAtom } from './labelAtom';
import { symbolsAtom } from './symbolAtom';
import {
  EdgeList,
  edgeListAtom,
  NodeId,
  nodeIdToEdgeIdAtom,
  NodeIdToEdgeIdMap,
  nodeListAtom,
  pointToNodeIdAtom,
  PointToNodeIdMap,
  NodeList,
} from './wireAtom';

export type ViewState = {
  nodeIdToLabelAtom: Map<NodeId, string>;
  symbolsAtom: Map<string, SymbolState[]>;
  nodeListAtom: NodeList;
  pointToNodeIdAtom: PointToNodeIdMap;
  edgeListAtom: EdgeList;
  nodeIdToEdgeIdAtom: NodeIdToEdgeIdMap;
};

export const logsAtom = atom({
  key: 'logs',
  default: [] as ViewState[],
});

export const logIndexAtom = atom({
  key: 'logIndex',
  default: 0,
});

export const viewSelector = selector<ViewState>({
  key: 'view',
  get: ({ get }) => ({
    nodeIdToLabelAtom: get(nodeIdToLabelAtom),
    symbolsAtom: get(symbolsAtom),
    nodeListAtom: get(nodeListAtom),
    pointToNodeIdAtom: get(pointToNodeIdAtom),
    edgeListAtom: get(edgeListAtom),
    nodeIdToEdgeIdAtom: get(nodeIdToEdgeIdAtom),
  }),
  set: ({ set }, v) => {
    if (!(v instanceof DefaultValue)) {
      console.log(v);
      set(nodeIdToLabelAtom, v.nodeIdToLabelAtom);
      set(symbolsAtom, v.symbolsAtom);
      set(nodeListAtom, v.nodeListAtom);
      set(pointToNodeIdAtom, v.pointToNodeIdAtom);
      set(edgeListAtom, v.edgeListAtom);
      set(nodeIdToEdgeIdAtom, v.nodeIdToEdgeIdAtom);
    }
  },
});

export const logSelector = selector({
  key: 'logsel',
  get: () => {},
  set: ({ get, set }) => {
    const view = get(viewSelector);
    const logs = get(logsAtom);
    const logIndex = get(logIndexAtom);
    // eslint-disable-next-line eqeqeq
    if (view == logs[logIndex - 1]) return;
    console.log(view, logs);
    const newLogs = logs.slice(0, logIndex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    newLogs.push(clone(view));
    if (newLogs.length > 100) newLogs.shift();
    else set(logIndexAtom, (prev) => prev + 1);
    set(logsAtom, newLogs);
  },
});
