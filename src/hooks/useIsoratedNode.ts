import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { symbolsAtom } from '../atoms';
import { NodeId } from '../helpers/wireHelper';
import { useEdge } from '../states/edgeState';
import { useLabel } from '../states/labelState';

export const useIsolatedNode = () => {
  const [symbols] = useRecoilState(symbolsAtom);
  const { getLabel } = useLabel();
  const { isEdgeVertex } = useEdge();

  const isIsolatedNode = useCallback(
    (id: NodeId) => {
      if (getLabel(id)) return false;
      if (isEdgeVertex(id)) return false;
      if (
        Array.from(symbols.values())
          .flat()
          .some((s) => s.nodeIds.includes(id))
      )
        return false;
      return true;
    },
    [isEdgeVertex, getLabel, symbols]
  );

  return { isIsolatedNode };
};

export default useIsolatedNode;
