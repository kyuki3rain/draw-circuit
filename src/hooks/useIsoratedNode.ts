import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { nodeIdToLabelAtom, symbolsAtom } from '../atoms';
import { NodeId } from '../helpers/wireHelper';
import { useEdge } from '../states/edgeState';

export const useIsolatedNode = () => {
  const [symbols] = useRecoilState(symbolsAtom);
  const [labelList] = useRecoilState(nodeIdToLabelAtom);
  const { isEdgeVertex } = useEdge();

  const isIsolatedNode = useCallback(
    (id: NodeId) => {
      if (labelList.get(id)) return false;
      if (isEdgeVertex(id)) return false;
      if (
        Array.from(symbols.values())
          .flat()
          .some((s) => s.nodeIds.includes(id))
      )
        return false;
      return true;
    },
    [isEdgeVertex, labelList, symbols]
  );

  return { isIsolatedNode };
};

export default useIsolatedNode;
