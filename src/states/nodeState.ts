import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';

import { getRandomId } from '../helpers/createIdHelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeList, PointToNodeIdMap, NodeId, isOnEdge, WireEdge } from '../helpers/wireHelper';
import { useEdge } from './edgeState';

const nodeListAtom = atom({
  key: 'nodeList',
  default: new Map() as NodeList,
});

const pointToNodeIdAtom = atom({
  key: 'pointToNodeId',
  default: new Map() as PointToNodeIdMap,
});

export const useNodeState = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);
  const { edgeList, removeEdge, setEdge } = useEdge();

  const getEdgeThrouphPoint = useCallback(
    (point: VirtualPoint) => {
      const edge = Array.from(edgeList.values()).find((e) => {
        const point1 = nodeList.get(e.node1)?.point;
        const point2 = nodeList.get(e.node2)?.point;
        if (!point1 || !point2) return false;
        return isOnEdge(point1, point2, point);
      });

      return edge;
    },
    [edgeList, nodeList]
  );

  const separateEdge = useCallback(
    (edge: WireEdge, nodeId: NodeId) => {
      removeEdge(edge.id);
      setEdge(edge.node1, nodeId, edge.id);
      setEdge(nodeId, edge.node2);
    },
    [removeEdge, setEdge]
  );

  const setNode = useCallback(
    (point: VirtualPoint, id?: NodeId) => {
      const nodeId = id || (getRandomId() as NodeId);
      setNodeList((prev) => new Map(prev.set(nodeId, { id: nodeId, point })));
      setPointToNodeIdMap((prev) => new Map(prev.set(JSON.stringify(point), nodeId)));

      const edge = getEdgeThrouphPoint(point);
      if (edge) separateEdge(edge, nodeId);

      return nodeId;
    },
    [getEdgeThrouphPoint, separateEdge, setNodeList, setPointToNodeIdMap]
  );

  const removeNode = useCallback(
    (nodeId: NodeId) => {
      const node = nodeList.get(nodeId);
      if (!node) return null;

      setNodeList((prev) => {
        prev.delete(nodeId);
        return new Map(prev);
      });
      setPointToNodeIdMap((prev) => {
        prev.delete(JSON.stringify(node.point));
        return new Map(prev);
      });

      return node;
    },
    [nodeList, setNodeList, setPointToNodeIdMap]
  );

  const getNode = useCallback(
    (point: VirtualPoint) => {
      const pString = JSON.stringify(point);
      const id = pointToNodeIdMap.get(pString);
      return id;
    },
    [pointToNodeIdMap]
  );

  const getOrCreateNode = useCallback((point: VirtualPoint) => getNode(point) || setNode(point), [getNode, setNode]);

  return { nodeList, removeNode, getNode, getOrCreateNode };
};

export const useNodeView = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);
  return {
    getNodeView: useCallback(() => ({ nodeList, pointToNodeIdMap }), [nodeList, pointToNodeIdMap]),
    setNodeView: useCallback(
      ({
        nodeList: newNodeList,
        pointToNodeIdMap: newPointToNodeIdMap,
      }: {
        nodeList: NodeList;
        pointToNodeIdMap: PointToNodeIdMap;
      }) => {
        setNodeList(newNodeList);
        setPointToNodeIdMap(newPointToNodeIdMap);
      },
      [setNodeList, setPointToNodeIdMap]
    ),
  };
};
