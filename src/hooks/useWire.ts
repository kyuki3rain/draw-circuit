import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { previewWirePointsAtom, selectedNodeIdAtom } from '../atoms';
import { add, sub, VirtualPoint } from '../helpers/gridhelper';
import { EdgeId } from '../helpers/wireHelper';
import { useEdge } from './useEdge';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const [previewWirePoints, setPreviewWirePoints] = useRecoilState(previewWirePointsAtom);
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
      setPreviewWirePoints((prev) => ({ point1: point, point2: prev.point2, prevCursorPoint: null }));
    },
    [selectedNodeId, setEdge, setNode, setPreviewWirePoints, setSelectedNodeId]
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
      const point1 =
        previewWirePoints.point1 &&
        previewWirePoints.prevCursorPoint &&
        add(previewWirePoints.point1, sub(point, previewWirePoints.prevCursorPoint));
      const point2 =
        previewWirePoints.point2 &&
        previewWirePoints.prevCursorPoint &&
        add(previewWirePoints.point2, sub(point, previewWirePoints.prevCursorPoint));
      if (!point1 || !point2) return;

      const id1 = setNode(point1);
      const id2 = setNode(point2);

      setEdge(id1, id2);
    },
    [previewWirePoints, setEdge, setNode]
  );

  return { setWire, cutWire, setCopyWire };
};

export default useWire;
