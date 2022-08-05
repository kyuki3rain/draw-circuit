import { selector } from 'recoil';
import { add } from '../helpers/gridhelper';
import { getConfig } from '../helpers/symbolHelper';
import { NodeId } from '../helpers/wireHelper';
import { componentStateFamily } from './componentAtom';
import { nodeIdToLabelAtom } from './labelAtom';
import { symbolsAtom } from './symbolAtom';
import { textsAtom } from './textAtom';
import { nodeIdToEdgeIdAtom, nodeListAtom, pointToNodeIdAtom } from './wireAtom';

// 日付をYYYY-MM-DDの書式で返すメソッド
function formatDate(dt: Date) {
  const y = dt.getFullYear();
  const m = `00${dt.getMonth() + 1}`.slice(-2);
  const d = `00${dt.getDate()}`.slice(-2);
  return `${y}-${m}-${d}`;
}

export const netListSelector = selector({
  key: 'netList',
  get: ({ get }) => {
    const symbols = get(symbolsAtom);
    const pointToNodeIdMap = get(pointToNodeIdAtom);
    const nodeIdToEdgeIdMap = get(nodeIdToEdgeIdAtom);
    const nodeIdToLabelMap = get(nodeIdToLabelAtom);
    const nodeList = get(nodeListAtom);
    const texts = get(textsAtom).filter((ts) => ts.isSpiceDirective);

    const allMap = new Map() as Map<NodeId, string>;
    const labelDict = new Map() as Map<string, string>;
    let defaultLabelId = 1;

    const checkNodeLabel = (checkId: NodeId, defaultLabel: string) => {
      allMap.set(checkId, defaultLabel);

      const idArray = Array.from(nodeIdToEdgeIdMap.get(checkId)?.keys() ?? []);
      const needCheck = idArray.filter((id) => !allMap.has(id));

      let label = defaultLabel;
      needCheck.map((id) => {
        const newLabel = checkNodeLabel(id, defaultLabel);
        label = label === defaultLabel ? newLabel : label;
        return label;
      });

      return nodeIdToLabelMap.get(checkId) ?? label;
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

    symbols.forEach((sarr, k) => {
      sarr.every((s, si) => {
        const points = get(componentStateFamily(s.type))?.nodePoints;
        const labels = points?.map((p) => {
          const nodeId = pointToNodeIdMap.get(JSON.stringify(add(p, s.point)));
          const dl = nodeId && allMap.get(nodeId);
          const label = dl && (labelDict.get(dl) || dl);
          return label === 'gnd' ? '0' : label;
        });

        let net = `${k}${si + 1} ${labels?.join(' ') ?? ''}`;
        const config = getConfig(s);
        if (config !== '') net += ` ${config}`;

        netList.push(net);

        return true;
      });
    });

    return netList.concat(texts.map((t) => t.body)).join('\n');
  },
});
