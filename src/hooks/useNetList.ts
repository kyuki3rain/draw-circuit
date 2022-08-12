import { useCallback } from 'react';

import { getConfig } from '../helpers/symbolHelper';
import { NodeId } from '../helpers/wireHelper';
import { useComponentStateFamily } from '../states/componentState';
import { useEdge } from '../states/edgeState';
import { useLabelState } from '../states/labelState';
import { useNodeState } from '../states/nodeState';
import { useSymbolState } from '../states/symbolState';
import { useText } from '../states/textState';

// 日付をYYYY-MM-DDの書式で返すメソッド
function formatDate(dt: Date) {
  const y = dt.getFullYear();
  const m = `00${dt.getMonth() + 1}`.slice(-2);
  const d = `00${dt.getDate()}`.slice(-2);
  return `${y}-${m}-${d}`;
}

export const useNetList = () => {
  const { getEdgeIdArray } = useEdge();
  const { nodeList, getNode } = useNodeState();
  const { symbols } = useSymbolState();
  const { getSpiceDirectives } = useText();
  const { getLabel } = useLabelState();
  const { getComponentNodePointsFamily } = useComponentStateFamily();

  const getNetList = useCallback(() => {
    const allMap = new Map() as Map<NodeId, string>;
    const labelDict = new Map() as Map<string, string>;
    let defaultLabelId = 1;

    const checkNodeLabel = (checkId: NodeId, defaultLabel: string) => {
      allMap.set(checkId, defaultLabel);

      const idArray = getEdgeIdArray(checkId);
      const needCheck = idArray.filter((id) => !allMap.has(id));

      let label = defaultLabel;
      needCheck.map((id) => {
        const newLabel = checkNodeLabel(id, defaultLabel);
        label = label === defaultLabel ? newLabel : label;
        return label;
      });

      return getLabel(checkId) ?? label;
    };

    nodeList.forEach((_, id) => {
      const defaultLabel = `N${`000${defaultLabelId}`.slice(-3)}`;
      if (!allMap.has(id)) {
        const label = checkNodeLabel(id, defaultLabel);
        labelDict.set(defaultLabel, label);
        defaultLabelId += 1;
      }
    });

    const netList: string[] = [`* made by draw-circuit ${formatDate(new Date())}`];

    symbols.forEach((sarr) => {
      sarr.every((s) => {
        if (!s.point) return false;

        const points = getComponentNodePointsFamily(s.componentName, s.point);
        const labels = points?.map((p) => {
          const nodeId = getNode(p);
          const dl = nodeId && allMap.get(nodeId);
          const label = dl && (labelDict.get(dl) || dl);
          return label === 'gnd' ? '0' : label;
        });

        let net = `${s.key} ${labels?.join(' ') ?? ''}`;
        const config = getConfig(s);
        if (config !== '') net += ` ${config}`;

        netList.push(net);

        return true;
      });
    });

    return netList.concat(getSpiceDirectives()).join('\n');
  }, [getComponentNodePointsFamily, getEdgeIdArray, getLabel, getNode, getSpiceDirectives, nodeList, symbols]);

  return { getNetList };
};

export default useNetList;
