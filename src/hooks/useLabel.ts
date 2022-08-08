import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { nodeIdToLabelAtom, previewLabelNameAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from '../helpers/wireHelper';
import { useNode } from '../states/nodeState';
import { useIsolatedNode } from './useIsoratedNode';

export const useLabel = () => {
  const setLabelList = useSetRecoilState(nodeIdToLabelAtom);
  const labelName = useRecoilValue(previewLabelNameAtom);
  const { getOrCreateNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setLabel = useCallback(
    (point: VirtualPoint) => {
      const id = getOrCreateNode(point);
      setLabelList((prev) => new Map(prev.set(id, labelName)));
    },
    [getOrCreateNode, setLabelList, labelName]
  );

  const removeLabel = useCallback(
    (id: NodeId) => {
      setLabelList((prev) => {
        prev.delete(id);
        return new Map(prev);
      });
      if (isIsolatedNode(id)) removeNode(id);
    },
    [isIsolatedNode, removeNode, setLabelList]
  );

  return { setLabel, removeLabel };
};

export default useLabel;
