import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { previewPointsAtom, selectedNodeIdAtom } from '../atoms';
import { add, sub, VirtualPoint } from '../helpers/gridhelper';
import { EdgeId } from '../helpers/wireHelper';
import { useEdge } from './useEdge';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const [previewPoints, setPreviewPoints] = useRecoilState(previewPointsAtom);
  const { setEdge, removeEdge } = useEdge();
  const { setNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setWire = useCallback(
    (point: VirtualPoint) => {
      const id = setNode(point);

      if (selectedNodeId !== null) {
        setEdge(id, selectedNodeId);
      }

      setSelectedNodeId(id);
      setPreviewPoints((prev) => [point, prev[1], null]);
    },
    [selectedNodeId, setEdge, setNode, setPreviewPoints, setSelectedNodeId]
  );

  const cutWire = useCallback(
    (edgeId: EdgeId) => {
      const res = removeEdge(edgeId);
      res?.map((nodeId) => nodeId && isIsolatedNode(nodeId) && removeNode(nodeId));
    },
    [isIsolatedNode, removeEdge, removeNode]
  );

  const setCopyWire = useCallback(
    (point: VirtualPoint) => {
      const point1 = previewPoints[0] && previewPoints[2] && add(previewPoints[0], sub(point, previewPoints[2]));
      const point2 = previewPoints[1] && previewPoints[2] && add(previewPoints[1], sub(point, previewPoints[2]));
      if (!point1 || !point2) return;

      const id1 = setNode(point1);
      const id2 = setNode(point2);

      setEdge(id1, id2);
    },
    [previewPoints, setEdge, setNode]
  );

  return { setWire, cutWire, setCopyWire };
};

export default useWire;
