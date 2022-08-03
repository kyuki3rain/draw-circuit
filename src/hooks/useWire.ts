import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { EdgeId, selectedNodeIdAtom } from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { useEdge } from './useEdge';
import { useNode } from './useNode';

export const useWire = () => {
  const [selectedNodeId, setSelectedNodeId] = useRecoilState(selectedNodeIdAtom);
  const { edgeList, setEdge, removeEdge } = useEdge();
  const { setNode, removeNode } = useNode();

  const setWire = useCallback(
    (point: VirtualPoint) => {
      const { id, map } = setNode(point);

      if (selectedNodeId !== null) {
        if (map) setEdge(id, selectedNodeId, map);
        else setEdge(id, selectedNodeId);
      }

      setSelectedNodeId(id);
    },
    [selectedNodeId]
  );

  const cutWire = useCallback(
    (edgeId: EdgeId) => {
      const res = removeEdge(edgeId);
      res?.map((nodeId) => removeNode(nodeId));
    },
    [removeEdge, removeNode]
  );

  return { setWire, cutWire, edgeList };
};

export default useWire;
