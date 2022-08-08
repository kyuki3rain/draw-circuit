import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { componentStateFamily, previewSymbolAtom, symbolIdAtomFamily, symbolsAtom } from '../atoms';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { SymbolState } from '../helpers/symbolHelper';
import { useNode } from '../states/nodeState';
import { useIsolatedNode } from './useIsoratedNode';

export const useSymbol = () => {
  const previewSymbol = useRecoilValue(previewSymbolAtom);
  const setSymbols = useSetRecoilState(symbolsAtom);
  const componentState = useRecoilValue(componentStateFamily(previewSymbol?.componentName));
  const [symbolId, setSymbolId] = useRecoilState(symbolIdAtomFamily(componentState?.type));
  const { getOrCreateNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      if (!componentState || !previewSymbol) return;
      const nodes = componentState.nodePoints.map((rp) => getOrCreateNode(add(rp, point)));
      setSymbols(
        (prev) =>
          new Map(
            prev.set(
              componentState.type,
              (prev.get(componentState.type) ?? []).concat({
                ...previewSymbol,
                point,
                nodeIds: nodes,
                key: `${componentState.type}${symbolId}`,
              })
            )
          )
      );

      setSymbolId((prev) => prev + 1);
    },
    [componentState, previewSymbol, setSymbols, symbolId, setSymbolId, getOrCreateNode]
  );

  const removeSymbol = useCallback(
    (c: SymbolState) => {
      setSymbols(
        (prev) =>
          new Map(
            prev.set(
              c.componentType,
              (prev.get(c.componentType) ?? []).filter((cc) => cc.key !== c.key)
            )
          )
      );

      c.nodeIds.filter((n) => isIsolatedNode(n)).map(removeNode);
    },
    [setSymbols, removeNode, isIsolatedNode]
  );

  const updateSymbol = useCallback(
    (c: SymbolState) => {
      setSymbols(
        (prev) =>
          new Map(
            prev.set(c.componentType, (prev.get(c.componentType) ?? []).filter((cc) => cc.key !== c.key).concat(c))
          )
      );
    },
    [setSymbols]
  );

  return { setSymbol, removeSymbol, updateSymbol };
};

export default useSymbol;
