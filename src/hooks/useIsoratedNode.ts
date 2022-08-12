import { useCallback } from 'react';

import { NodeId } from '../helpers/wireHelper';
import { useEdge } from '../states/edgeState';
import { useLabelState } from '../states/labelState';
import { useSymbolState } from '../states/symbolState';

export const useIsolatedNode = () => {
  const { symbols } = useSymbolState();
  const { getLabel } = useLabelState();
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
