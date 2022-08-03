import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { selectedNodeIdAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { EdgeId } from '../helpers/wireHelper';
import { useEdge } from './useEdge';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const { edgeList, setEdge, removeEdge } = useEdge();
  const { setNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setWire = useCallback(
    (point: VirtualPoint) => {
      const { id, map } = setNode(point);

      if (selectedNodeId !== null) {
        if (map) setEdge(id, selectedNodeId, map);
        else setEdge(id, selectedNodeId);
      }

      setSelectedNodeId(id);
    },
    [selectedNodeId, setEdge, setNode, setSelectedNodeId]
  );

  const cutWire = useCallback(
    (edgeId: EdgeId) => {
      const res = removeEdge(edgeId);
      res?.map((nodeId) => isIsolatedNode(nodeId) && removeNode(nodeId));
    },
    [isIsolatedNode, removeEdge, removeNode]
  );

  return { setWire, cutWire, edgeList };
};

export default useWire;
