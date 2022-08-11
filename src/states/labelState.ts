import { useCallback } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from '../helpers/wireHelper';
import { useNode } from './nodeState';

const nodeIdToLabelAtom = atom({
  key: 'nodeIdToLabel',
  default: new Map() as Map<NodeId, string>,
});

const previewLabelNameAtom = atom({
  key: 'previewLabelName',
  default: null as string | null,
});

export const useLabel = () => {
  const [labelList, setLabelList] = useRecoilState(nodeIdToLabelAtom);
  const labelName = useRecoilValue(previewLabelNameAtom);
  const { getOrCreateNode } = useNode();

  const getLabel = useCallback((id: NodeId) => labelList.get(id), [labelList]);

  const setLabel = useCallback(
    (point: VirtualPoint) => {
      if (!labelName) return;
      const id = getOrCreateNode(point);
      setLabelList((prev) => new Map(prev.set(id, labelName)));
    },
    [getOrCreateNode, setLabelList, labelName]
  );

  const deleteLabel = useCallback(
    (id: NodeId) => {
      setLabelList((prev) => {
        prev.delete(id);
        return new Map(prev);
      });
    },
    [setLabelList]
  );

  return { labelList, getLabel, setLabel, deleteLabel };
};

export const useLabelPreview = () => {
  const [labelName, setLabelName] = useRecoilState(previewLabelNameAtom);

  const getLabelPreview = useCallback(() => labelName, [labelName]);
  const resetLabelPreview = useCallback(() => setLabelName(null), [setLabelName]);
  const setLabelPreview = useCallback(
    (newLabelName: string) => {
      setLabelName(newLabelName);
    },
    [setLabelName]
  );
  const initializeLabelPreview = useCallback(
    (initialLabelName: string) => setLabelPreview(initialLabelName),
    [setLabelPreview]
  );

  return {
    getLabelPreview,
    resetLabelPreview,
    initializeLabelPreview,
    setLabelPreview,
  };
};

export const useLabelView = () => {
  const [labelList, setLabelList] = useRecoilState(nodeIdToLabelAtom);

  return {
    getLabelView: useCallback(
      () => ({
        labelList,
      }),
      [labelList]
    ),
    setLabelView: useCallback(
      ({ labelList: newLabelList }: { labelList: Map<NodeId, string> }) => setLabelList(newLabelList),
      [setLabelList]
    ),
  };
};
