import { atom, DefaultValue, selector } from 'recoil';
import { clone } from '../helpers/cloneHelper';
import { ComponentType } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';
import { EdgeList, NodeId, NodeList, NodeIdToEdgeIdMap, PointToNodeIdMap } from '../helpers/wireHelper';
import { nodeIdToLabelAtom } from './labelAtom';
import { symbolsAtom } from './symbolAtom';
import { textsAtom, TextState } from './textAtom';
import { edgeListAtom, nodeIdToEdgeIdAtom, nodeListAtom, pointToNodeIdAtom } from './wireAtom';

export type ViewState = {
  nodeIdToLabelAtom: Map<NodeId, string>;
  symbolsAtom: Map<ComponentType, SymbolState[]>;
  nodeListAtom: NodeList;
  pointToNodeIdAtom: PointToNodeIdMap;
  edgeListAtom: EdgeList;
  nodeIdToEdgeIdAtom: NodeIdToEdgeIdMap;
  textsAtom: TextState[];
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
    textsAtom: get(textsAtom),
  }),
  set: ({ set }, v) => {
    if (!(v instanceof DefaultValue)) {
      set(nodeIdToLabelAtom, v.nodeIdToLabelAtom);
      set(symbolsAtom, v.symbolsAtom);
      set(nodeListAtom, v.nodeListAtom);
      set(pointToNodeIdAtom, v.pointToNodeIdAtom);
      set(edgeListAtom, v.edgeListAtom);
      set(nodeIdToEdgeIdAtom, v.nodeIdToEdgeIdAtom);
      set(textsAtom, v.textsAtom);
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
    const newLogs = logs.slice(0, logIndex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    newLogs.push(clone(view));
    if (newLogs.length > 100) newLogs.shift();
    else set(logIndexAtom, (prev) => prev + 1);
    set(logsAtom, newLogs);
  },
});
