import { useMemo } from 'react';

import { useEdge } from '../states/edgeState';
import { useModal } from '../states/modalState';
import { useNodeState } from '../states/nodeState';
import { usePreviewNodePosition } from './usePreview';

export const useNode = () => {
  const { nodeList } = useNodeState();
  const { getEdgeIdArray } = useEdge();
  const { previewNodePosition } = usePreviewNodePosition();
  const { open } = useModal();

  const circleNodePointArray = useMemo(
    () =>
      Array.from(nodeList.values())
        .filter((n) => {
          const edgeList = getEdgeIdArray(n.id);
          return edgeList && edgeList.length > 3;
        })
        .map((n) => n.point),
    [getEdgeIdArray, nodeList]
  );

  const rectNodePointArray = useMemo(
    () =>
      Array.from(nodeList.values())
        .filter((n) => {
          const edgeList = getEdgeIdArray(n.id);
          return (edgeList?.length ?? 0) === 0;
        })
        .map((n) => n.point),
    [getEdgeIdArray, nodeList]
  );

  const previewNodePoint = useMemo(() => (open ? null : previewNodePosition ?? null), [open, previewNodePosition]);

  return {
    circleNodePointArray,
    rectNodePointArray,
    previewNodePoint,
  };
};
