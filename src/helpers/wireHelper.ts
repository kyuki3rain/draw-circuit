import { VirtualPoint } from './gridhelper';

export type NodeId = string & { _brand: 'NodeId' };
export type WireNode = {
  id: NodeId;
  point: VirtualPoint;
};

export type NodeList = Map<NodeId, WireNode>;

export type PointToNodeIdMap = Map<string, NodeId>;

export type EdgeId = string & { _brand: 'EdgeId' };
export type WireEdge = {
  id: EdgeId;
  node1: NodeId;
  node2: NodeId;
};

export type EdgeList = Map<EdgeId, WireEdge>;

export type NodeIdToEdgeIdMap = Map<NodeId, Map<NodeId, EdgeId>>;
