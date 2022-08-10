import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { useCallback } from 'react';
import { VirtualPoint } from '../helpers/gridhelper';
import { useNode } from './nodeState';
import { NodeId } from '../helpers/wireHelper';

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
  const initializeLabelPreview = useCallback(() => resetLabelPreview(), [resetLabelPreview]);
  const setLabelPreview = useCallback(
    (newLabelName: string) => {
      setLabelName(newLabelName);
    },
    [setLabelName]
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
