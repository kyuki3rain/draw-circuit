import { useCallback } from 'react';

import { NodeId } from '../helpers/wireHelper';
import { useEdge } from '../states/edgeState';
import { useLabel } from '../states/labelState';
import { useSymbol } from '../states/symbolState';

export const useIsolatedNode = () => {
  const { symbols } = useSymbol();
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
