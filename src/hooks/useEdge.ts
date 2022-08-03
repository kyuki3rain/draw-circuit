import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { edgeListAtom, nodeIdToEdgeIdAtom } from '../atoms';
import { getRandomId } from '../helpers/createIdHelper';
import { EdgeId, NodeId, NodeIdToEdgeIdMap, WireEdge } from '../helpers/wireHelper';

export const useEdge = () => {
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const [nodeIdToEdgeIdMap, setNodeIdToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);

  const setEdge = useCallback(
    (node1: NodeId, node2: NodeId, map?: NodeIdToEdgeIdMap) => {
      const edgeId = getRandomId() as EdgeId;
      setEdgeList(edgeList.set(edgeId, { id: edgeId, node1, node2 }));

      setNodeIdToEdgeIdMap(
        (map ?? nodeIdToEdgeIdMap)
          .set(node1, ((map ?? nodeIdToEdgeIdMap).get(node1) ?? (new Map() as Map<NodeId, EdgeId>)).set(node2, edgeId))
          .set(node2, ((map ?? nodeIdToEdgeIdMap).get(node2) ?? (new Map() as Map<NodeId, EdgeId>)).set(node1, edgeId))
      );

      return edgeId;
    },
    [edgeList, nodeIdToEdgeIdMap]
  );

  const removeEdge = useCallback(
    (edgeId: EdgeId) => {
      const edge = edgeList.get(edgeId);
      if (!edge) return null;

      const { node1, node2 } = edge;

      const node1List = nodeIdToEdgeIdMap.get(node1);
      const node2List = nodeIdToEdgeIdMap.get(node2);
      if (!node1List || !node2List) return null;

      node1List.delete(node2);
      node2List.delete(node1);
      setNodeIdToEdgeIdMap(nodeIdToEdgeIdMap.set(node1, node1List).set(node2, node2List));

      edgeList.delete(edgeId);
      setEdgeList(new Map(edgeList));

      return [node1, node2];
    },
    [edgeList, nodeIdToEdgeIdMap, setEdgeList, setNodeIdToEdgeIdMap]
  );

  const separateEdge = useCallback(
    (id: NodeId, edge: WireEdge) => {
      edgeList.set(edge.id, { id: edge.id, node1: edge.node1, node2: id });
      const newEdgeId = setEdge(id, edge.node2);
      const node1List = nodeIdToEdgeIdMap.get(edge.node1);
      const node2List = nodeIdToEdgeIdMap.get(edge.node2);
      if (!node1List || !node2List) return null;

      node1List.delete(edge.node2);
      node2List.delete(edge.node1);

      const map = nodeIdToEdgeIdMap
        .set(edge.node1, node1List.set(id, edge.id))
        .set(edge.node2, node2List.set(id, newEdgeId))
        .set(
          id,
          (nodeIdToEdgeIdMap.get(id) ?? (new Map() as Map<NodeId, EdgeId>))
            .set(edge.node1, edge.id)
            .set(edge.node2, newEdgeId)
        );

      setNodeIdToEdgeIdMap(map);

      return map;
    },
    [edgeList, nodeIdToEdgeIdMap, setEdge, setNodeIdToEdgeIdMap]
  );

  return { edgeList, setEdge, separateEdge, removeEdge };
};

export default useEdge;
