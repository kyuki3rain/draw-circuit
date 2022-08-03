import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { componentStateFamily, symbolsAtom, symbolTypeAtom } from '../atoms';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { SymbolState } from '../helpers/symbolHelper';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useSymbol = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);
  const componentState = useRecoilValue(componentStateFamily(symbolType));
  const { setNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      if (!componentState) return;
      const nodes = componentState.nodePoints.map((rp) => setNode(add(rp, point)).id);
      const sarr = symbols.get(componentState.componentType) ?? [];
      setSymbols(
        symbols.set(
          componentState.componentType,
          sarr.concat({
            type: symbolType,
            componentType: componentState.componentType,
            point,
            nodeIds: nodes,
            key: `symbol_${componentState.componentType}${sarr.length}`,
            config: componentState.defaultConfig ?? '',
          })
        )
      );
    },
    [symbols, symbolType]
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
    [symbols, symbolType]
  );

  return { setSymbol, removeSymbol };
};

export default useSymbol;
