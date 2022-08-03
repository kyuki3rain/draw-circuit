import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { nodeIdToEdgeIdAtom, nodeIdToLabelAtom, symbolsAtom } from '../atoms';
import { NodeId } from '../helpers/wireHelper';

export const useIsolatedNode = () => {
  const [nodeIdToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);
  const [symbols] = useRecoilState(symbolsAtom);
  const [labelList] = useRecoilState(nodeIdToLabelAtom);

  const isIsolatedNode = useCallback(
    (id: NodeId) => {
      if (labelList.get(id)) return false;
      if ((nodeIdToEdgeIdMap.get(id)?.size ?? 0) !== 0) return false;
      if (
        Array.from(symbols.values())
          .flat()
          .some((s) => s.nodes.includes(id))
      )
        return false;
      return true;
    },
    [labelList, nodeIdToEdgeIdMap, symbols]
  );

  return { isIsolatedNode };
};

export default useIsolatedNode;
