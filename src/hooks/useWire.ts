import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { previewWirePointsAtom, selectedNodeIdAtom } from '../atoms';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { EdgeId } from '../helpers/wireHelper';
import { useEdge } from './useEdge';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const previewWirePoints = useRecoilValue(previewWirePointsAtom);
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
    },
    [selectedNodeId, setEdge, setNode, setSelectedNodeId]
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
      const point1 = previewWirePoints.point1Relative && add(previewWirePoints.point1Relative, point);
      const point2 = previewWirePoints.point2Relative && add(previewWirePoints.point2Relative, point);

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
