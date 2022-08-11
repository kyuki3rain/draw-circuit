import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';

import { add, sub, VirtualPoint } from '../helpers/gridhelper';
import { EdgeId, EdgeList, NodeId, NodeList, NodeIdToEdgeIdMap, PointToNodeIdMap } from '../helpers/wireHelper';
import { useIsolatedNode } from '../hooks/useIsoratedNode';
import { useCursorPosition } from './cursorPositionState';
import { useEdge, useEdgeView } from './edgeState';
import { useNode, useNodeView } from './nodeState';

const fixedNodeIdAtom = atom({
  key: 'fixedNodeId',
  default: null as NodeId | null,
});

const previewWirePointsAtom = atom({
  key: 'previewWirePoints',
  default: null as {
    point1Relative: VirtualPoint;
    point2Relative: VirtualPoint;
  } | null,
});

export const useWirePreviewWithoutNode = () => {
  const [previewWirePoints, setPreviewWirePoints] = useRecoilState(previewWirePointsAtom);
  const { getCursorPosition } = useCursorPosition();

  const getWirePreviewWithoutNode = useCallback(
    (specifiedPoint?: VirtualPoint) => {
      const point = specifiedPoint || getCursorPosition();
      if (!point) return [null, null];

      const vp1 = previewWirePoints && add(previewWirePoints.point1Relative, point);
      const vp2 = previewWirePoints && add(previewWirePoints.point2Relative, point);
      return [vp1, vp2];
    },
    [getCursorPosition, previewWirePoints]
  );

  const resetWirePreviewWithoutNode = useCallback(() => {
    setPreviewWirePoints(null);
  }, [setPreviewWirePoints]);

  const initializeWirePreviewWithoutNode = useCallback(
    (p1: VirtualPoint, p2: VirtualPoint, point: VirtualPoint) => {
      setPreviewWirePoints({ point1Relative: sub(p1, point), point2Relative: sub(p2, point) });
    },
    [setPreviewWirePoints]
  );

  return {
    getWirePreviewWithoutNode,
    resetWirePreviewWithoutNode,
    initializeWirePreviewWithoutNode,
  };
};

export const useWirePreviewWithNode = () => {
  const [fixedNodeId, setFixedNodeId] = useRecoilState(fixedNodeIdAtom);
  const { getCursorPosition } = useCursorPosition();
  const { nodeList, getOrCreateNode } = useNode();

  const getWirePreviewWithNode = useCallback(
    (specifiedPoint?: VirtualPoint) => {
      const vp1 = (fixedNodeId && nodeList.get(fixedNodeId)?.point) ?? null;
      return [vp1, specifiedPoint ?? getCursorPosition()];
    },
    [fixedNodeId, getCursorPosition, nodeList]
  );

  const setWirePreviewWithNode = useCallback(
    (point: VirtualPoint) => {
      setFixedNodeId(getOrCreateNode(point));
    },
    [getOrCreateNode, setFixedNodeId]
  );

  const resetWirePreviewWithNode = useCallback(() => {
    setFixedNodeId(null);
  }, [setFixedNodeId]);

  const initializeWirePreviewWithNode = useCallback(() => {
    resetWirePreviewWithNode();
  }, [resetWirePreviewWithNode]);

  return {
    getWirePreviewWithNode,
    setWirePreviewWithNode,
    resetWirePreviewWithNode,
    initializeWirePreviewWithNode,
  };
};

export const useWire = () => {
  const { setEdge, removeEdge } = useEdge();
  const { getOrCreateNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();
  const { getWirePreviewWithoutNode } = useWirePreviewWithoutNode();
  const { getWirePreviewWithNode, setWirePreviewWithNode } = useWirePreviewWithNode();

  const setWireFromPoints = useCallback(
    (point1: VirtualPoint, point2: VirtualPoint) => {
      const id1 = getOrCreateNode(point1);
      const id2 = getOrCreateNode(point2);
      setEdge(id1, id2);
    },
    [setEdge, getOrCreateNode]
  );

  const setWireWithoutNode = useCallback(
    (point: VirtualPoint) => {
      const [p1, p2] = getWirePreviewWithoutNode(point);
      if (!p1 || !p2) return;

      setWireFromPoints(p1, p2);
    },
    [getWirePreviewWithoutNode, setWireFromPoints]
  );

  const setWireWithNode = useCallback(
    (point: VirtualPoint) => {
      const [fixedNodePoint] = getWirePreviewWithNode(point);
      setWirePreviewWithNode(point);
      if (!fixedNodePoint) return;

      setWireFromPoints(fixedNodePoint, point);
    },
    [getWirePreviewWithNode, setWireFromPoints, setWirePreviewWithNode]
  );

  const setWire = useCallback(
    (point: VirtualPoint, withNode: boolean) => {
      if (withNode) setWireWithNode(point);
      else setWireWithoutNode(point);
    },
    [setWireWithNode, setWireWithoutNode]
  );

  const cutWire = useCallback(
    (edgeId: EdgeId) => {
      const res = removeEdge(edgeId);
      [res?.node1, res?.node2].map((nodeId) => nodeId && isIsolatedNode(nodeId) && removeNode(nodeId));
    },
    [isIsolatedNode, removeEdge, removeNode]
  );

  return { setWire, cutWire };
};

export const useWireView = () => {
  const { getNodeView, setNodeView } = useNodeView();
  const { getEdgeView, setEdgeView } = useEdgeView();

  return {
    getWireView: useCallback(() => ({ nodes: getNodeView(), edges: getEdgeView() }), [getNodeView, getEdgeView]),
    setWireView: useCallback(
      ({
        nodes,
        edges,
      }: {
        nodes: {
          nodeList: NodeList;
          pointToNodeIdMap: PointToNodeIdMap;
        };
        edges: {
          edgeList: EdgeList;
          nodeIdToEdgeIdMap: NodeIdToEdgeIdMap;
        };
      }) => {
        setNodeView(nodes);
        setEdgeView(edges);
      },
      [setEdgeView, setNodeView]
    ),
  };
};
