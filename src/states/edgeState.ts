import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';

import { getRandomId } from '../helpers/createIdHelper';
import { EdgeList, NodeIdToEdgeIdMap, NodeId, EdgeId } from '../helpers/wireHelper';

const edgeListAtom = atom({
  key: 'edgeList',
  default: new Map() as EdgeList,
});

const nodeIdToEdgeIdAtom = atom({
  key: 'nodeIdToEdgeId',
  default: new Map() as NodeIdToEdgeIdMap,
});

export const useEdge = () => {
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const [nodeIdToEdgeIdMap, setNodeIdToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);

  const setEdge = useCallback(
    (node1: NodeId, node2: NodeId, id?: EdgeId) => {
      const edgeId = id || (getRandomId() as EdgeId);

      setNodeIdToEdgeIdMap(
        (prev) =>
          new Map(
            prev
              .set(node1, (prev.get(node1) ?? (new Map() as Map<NodeId, EdgeId>)).set(node2, edgeId))
              .set(node2, (prev.get(node2) ?? (new Map() as Map<NodeId, EdgeId>)).set(node1, edgeId))
          )
      );
      setEdgeList((prev) => new Map(prev.set(edgeId, { id: edgeId, node1, node2 })));

      return edgeId;
    },
    [setEdgeList, setNodeIdToEdgeIdMap]
  );

  const removeEdge = useCallback(
    (edgeId: EdgeId) => {
      const edge = edgeList.get(edgeId);
      if (!edge) return null;

      setNodeIdToEdgeIdMap((prev) => {
        const node1List = prev.get(edge.node1);
        const node2List = prev.get(edge.node2);
        if (!node1List || !node2List) return prev;

        node1List.delete(edge.node2);
        node2List.delete(edge.node1);
        return new Map(prev.set(edge.node1, node1List).set(edge.node2, node2List));
      });

      setEdgeList((prev) => {
        prev.delete(edgeId);
        return new Map(edgeList);
      });

      return edge;
    },
    [edgeList, setEdgeList, setNodeIdToEdgeIdMap]
  );

  const getEdgeIdArray = useCallback(
    (id: NodeId) => Array.from(nodeIdToEdgeIdMap.get(id)?.keys() ?? []),
    [nodeIdToEdgeIdMap]
  );

  const isEdgeVertex = useCallback((id: NodeId) => (nodeIdToEdgeIdMap.get(id)?.size ?? 0) !== 0, [nodeIdToEdgeIdMap]);

  const getEdgeView = useCallback(() => ({ list: edgeList, map: nodeIdToEdgeIdMap }), [edgeList, nodeIdToEdgeIdMap]);

  return { edgeList, setEdge, removeEdge, getEdgeIdArray, isEdgeVertex, getEdgeView };
};

export const useEdgeView = () => {
  const [edgeList, setEdgeList] = useRecoilState(edgeListAtom);
  const [nodeIdToEdgeIdMap, setPointToEdgeIdMap] = useRecoilState(nodeIdToEdgeIdAtom);
  return {
    getEdgeView: useCallback(() => ({ edgeList, nodeIdToEdgeIdMap }), [edgeList, nodeIdToEdgeIdMap]),
    setEdgeView: useCallback(
      ({
        edgeList: newEdgeList,
        nodeIdToEdgeIdMap: newNodeIdToEdgeIdMap,
      }: {
        edgeList: EdgeList;
        nodeIdToEdgeIdMap: NodeIdToEdgeIdMap;
      }) => {
        setEdgeList(newEdgeList);
        setPointToEdgeIdMap(newNodeIdToEdgeIdMap);
      },
      [setEdgeList, setPointToEdgeIdMap]
    ),
  };
};
