import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { nodeIdToLabelAtom, symbolsAtom, textsAtom, TextState } from '../atoms';
import { ComponentType } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';
import { EdgeList, NodeId, NodeIdToEdgeIdMap, PointToNodeIdMap, NodeList } from '../helpers/wireHelper';
import { useEdgeView } from '../states/edgeState';

import { useNodeView } from '../states/nodeState';

export type ViewState = {
  nodes: {
    nodeList: NodeList;
    pointToNodeIdMap: PointToNodeIdMap;
  };
  edges: {
    edgeList: EdgeList;
    nodeIdToEdgeIdMap: NodeIdToEdgeIdMap;
  };
  nodeIdToLabelAtom: Map<NodeId, string>;
  symbolsAtom: Map<ComponentType, SymbolState[]>;
  textsAtom: TextState[];
};

export const useView = () => {
  const { getNodeView, setNodeView } = useNodeView();
  const { getEdgeView, setEdgeView } = useEdgeView();
  const [nodeIdToLabelMap, setNodeIdToLabelMap] = useRecoilState(nodeIdToLabelAtom);
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const [texts, setTexts] = useRecoilState(textsAtom);

  const getView = useCallback(
    () => ({
      nodes: getNodeView(),
      edges: getEdgeView(),
      nodeIdToLabelAtom: nodeIdToLabelMap,
      symbolsAtom: symbols,
      textsAtom: texts,
    }),
    [getEdgeView, getNodeView, nodeIdToLabelMap, symbols, texts]
  );

  const setView = useCallback(
    (view: ViewState) => {
      setNodeView(view.nodes);
      setEdgeView(view.edges);
      setNodeIdToLabelMap(view.nodeIdToLabelAtom);
      setSymbols(view.symbolsAtom);
      setTexts(view.textsAtom);
    },
    [setEdgeView, setNodeIdToLabelMap, setNodeView, setSymbols, setTexts]
  );

  return { getView, setView };
};

export default useView;
