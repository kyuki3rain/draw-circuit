import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { nodeListAtom, pointToNodeIdAtom } from '../atoms';
import { getRandomId } from '../helpers/createIdHelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { NodeId } from '../helpers/wireHelper';
import { useEdge } from './useEdge';

const isOnEdge = (a: VirtualPoint, b: VirtualPoint, c: VirtualPoint) => {
  if (a === c || b === c) return true;

  if (b.vx === a.vx) return c.vx === a.vx && (c.vy - a.vy) / (b.vy - a.vy) > 0 && (c.vy - a.vy) / (b.vy - a.vy) < 1;
  if (b.vy === a.vy) return c.vy === a.vy && (c.vx - a.vx) / (b.vx - a.vx) > 0 && (c.vx - a.vx) / (b.vx - a.vx) < 1;

  return (
    (c.vx - a.vx) / (b.vx - a.vx) > 0 &&
    (c.vx - a.vx) / (b.vx - a.vx) < 1 &&
    (c.vx - a.vx) / (b.vx - a.vx) === (c.vy - a.vy) / (b.vy - a.vy)
  );
};

export const useNode = () => {
  const [nodeList, setNodeList] = useRecoilState(nodeListAtom);
  const [pointToNodeIdMap, setPointToNodeIdMap] = useRecoilState(pointToNodeIdAtom);
  const { edgeList, separateEdge } = useEdge();

  const getNodeThroughEdge = useCallback(
    (point: VirtualPoint) =>
      Array.from(edgeList.values()).find((e) => {
        const point1 = nodeList.get(e.node1)?.point;
        const point2 = nodeList.get(e.node2)?.point;
        if (!point1 || !point2) return false;
        return isOnEdge(point1, point2, point);
      }),
    [edgeList, nodeList]
  );

  const setNode = useCallback(
    (point: VirtualPoint) => {
      const pString = JSON.stringify(point);
      const id = pointToNodeIdMap.get(pString);
      if (id) return id;

      const newId = getRandomId() as NodeId;
      setNodeList((prev) => new Map(prev.set(newId, { id: newId, point })));
      setPointToNodeIdMap((prev) => new Map(prev.set(pString, newId)));

      const edge = getNodeThroughEdge(point);
      if (edge) {
        separateEdge(newId, edge.id);
      }

      return newId;
    },
    [pointToNodeIdMap, setNodeList, setPointToNodeIdMap, getNodeThroughEdge, separateEdge]
  );

  const removeNode = useCallback(
    (nodeId: NodeId) => {
      const node = nodeList.get(nodeId);
      if (!node) return false;

      setNodeList((prev) => {
        prev.delete(nodeId);
        return prev;
      });
      setPointToNodeIdMap((prev) => {
        prev.delete(JSON.stringify(node.point));
        return prev;
      });

      return true;
    },
    [nodeList, setNodeList, setPointToNodeIdMap]
  );

  return { setNode, removeNode };
};

export default useNode;
