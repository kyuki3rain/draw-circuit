import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { edgeListAtom, nodeIdToEdgeIdAtom } from '../atoms';
import { getRandomId } from '../helpers/createIdHelper';
import { EdgeId, NodeId } from '../helpers/wireHelper';

export const useEdge = () => {
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const setNodeIdToEdgeIdMap = useSetRecoilState(nodeIdToEdgeIdAtom);

  const setEdge = useCallback(
    (node1: NodeId, node2: NodeId, id?: EdgeId) => {
      const edgeId = id || (getRandomId() as EdgeId);

      setNodeIdToEdgeIdMap((prev) =>
        prev
          .set(node1, (prev.get(node1) ?? (new Map() as Map<NodeId, EdgeId>)).set(node2, edgeId))
          .set(node2, (prev.get(node2) ?? (new Map() as Map<NodeId, EdgeId>)).set(node1, edgeId))
      );
      setEdgeList((prev) => new Map(prev.set(edgeId, { id: edgeId, node1, node2 })));

      return edgeId;
    },
    [setEdgeList, setNodeIdToEdgeIdMap]
  );

  const removeEdge = useCallback(
    (edgeId: EdgeId) => {
      const edge = edgeList.get(edgeId);
      if (!edge) return [null, null];

      setNodeIdToEdgeIdMap((prev) => {
        const node1List = prev.get(edge.node1);
        const node2List = prev.get(edge.node2);
        if (!node1List || !node2List) return prev;

        node1List.delete(edge.node2);
        node2List.delete(edge.node1);
        return prev.set(edge.node1, node1List).set(edge.node2, node2List);
      });

      setEdgeList((prev) => {
        prev.delete(edgeId);
        return new Map(edgeList);
      });

      return [edge.node1, edge.node2];
    },
    [edgeList, setEdgeList, setNodeIdToEdgeIdMap]
  );

  const separateEdge = useCallback(
    (id: NodeId, edgeId: EdgeId) => {
      const [node1, node2] = removeEdge(edgeId);
      if (!node1 || !node2) return;
      setEdge(node1, id, edgeId);
      setEdge(id, node2);
    },
    [removeEdge, setEdge]
  );

  return { edgeList, setEdge, separateEdge, removeEdge };
};

export default useEdge;
