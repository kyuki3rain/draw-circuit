import { useCallback } from 'react';
import { ComponentType } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';
import { EdgeList, NodeId, NodeIdToEdgeIdMap, PointToNodeIdMap, NodeList } from '../helpers/wireHelper';
import { useLabelView } from '../states/labelState';
import { useSymbolView } from '../states/symbolState';
import { TextState, useTextView } from '../states/textState';
import { useWireView } from '../states/wireState';

export type ViewState = {
  wires: {
    nodes: {
      nodeList: NodeList;
      pointToNodeIdMap: PointToNodeIdMap;
    };
    edges: {
      edgeList: EdgeList;
      nodeIdToEdgeIdMap: NodeIdToEdgeIdMap;
    };
  };
  labels: {
    labelList: Map<NodeId, string>;
  };
  symbols: {
    symbolStates: Map<ComponentType, SymbolState[]>;
  };
  texts: {
    textStates: TextState[];
  };
};

export const useView = () => {
  const { getWireView, setWireView } = useWireView();
  const { getLabelView, setLabelView } = useLabelView();
  const { getTextView, setTextView } = useTextView();
  const { getSymbolView, setSymbolView } = useSymbolView();

  const getView = useCallback(
    () => ({
      wires: getWireView(),
      labels: getLabelView(),
      symbols: getSymbolView(),
      texts: getTextView(),
    }),
    [getWireView, getLabelView, getSymbolView, getTextView]
  );

  const setView = useCallback(
    (view: ViewState) => {
      setWireView(view.wires);
      setLabelView(view.labels);
      setTextView(view.texts);
      setSymbolView(view.symbols);
    },
    [setLabelView, setSymbolView, setTextView, setWireView]
  );

  return { getView, setView };
};

export default useView;
