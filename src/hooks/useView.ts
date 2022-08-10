import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { symbolsAtom } from '../atoms';
import { ComponentType } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';
import { EdgeList, NodeId, NodeIdToEdgeIdMap, PointToNodeIdMap, NodeList } from '../helpers/wireHelper';
import { useLabelView } from '../states/labelState';
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
  symbolsAtom: Map<ComponentType, SymbolState[]>;
  texts: {
    textStates: TextState[];
  };
};

export const useView = () => {
  const { getWireView, setWireView } = useWireView();
  const { getLabelView, setLabelView } = useLabelView();
  const { getTextView, setTextView } = useTextView();
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);

  const getView = useCallback(
    () => ({
      wires: getWireView(),
      labels: getLabelView(),
      symbolsAtom: symbols,
      texts: getTextView(),
    }),
    [getLabelView, getTextView, getWireView, symbols]
  );

  const setView = useCallback(
    (view: ViewState) => {
      setWireView(view.wires);
      setLabelView(view.labels);
      setTextView(view.texts);
      setSymbols(view.symbolsAtom);
    },
    [setLabelView, setSymbols, setTextView, setWireView]
  );

  return { getView, setView };
};

export default useView;
