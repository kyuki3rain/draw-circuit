import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { nodeIdToLabelAtom, previewLabelNameAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from '../helpers/wireHelper';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useLabel = () => {
  const [labelList, setLabelList] = useRecoilState(nodeIdToLabelAtom);
  const labelName = useRecoilValue(previewLabelNameAtom);
  const { setNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setLabel = useCallback(
    (point: VirtualPoint) => {
      const id = setNode(point);
      setLabelList(labelList.set(id, labelName));
    },
    [setNode, setLabelList, labelList, labelName]
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
