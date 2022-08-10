import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { symbolsAtom, textsAtom, TextState } from '../atoms';
import { ComponentType } from '../helpers/componentHelper';
import { SymbolState } from '../helpers/symbolHelper';
import { EdgeList, NodeId, NodeIdToEdgeIdMap, PointToNodeIdMap, NodeList } from '../helpers/wireHelper';
import { useLabelView } from '../states/labelState';
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
  textsAtom: TextState[];
};

export const useView = () => {
  const { getWireView, setWireView } = useWireView();
  const { getLabelView, setLabelView } = useLabelView();
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const [texts, setTexts] = useRecoilState(textsAtom);

  const getView = useCallback(
    () => ({
      wires: getWireView(),
      labels: getLabelView(),
      symbolsAtom: symbols,
      textsAtom: texts,
    }),
    [getLabelView, getWireView, symbols, texts]
  );

  const setView = useCallback(
    (view: ViewState) => {
      setWireView(view.wires);
      setLabelView(view.labels);
      setSymbols(view.symbolsAtom);
      setTexts(view.textsAtom);
    },
    [setLabelView, setSymbols, setTexts, setWireView]
  );

  return { getView, setView };
};

export default useView;
