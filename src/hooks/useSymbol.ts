import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { componentStateFamily, previewSymbolAtom, symbolIdAtomFamily, symbolsAtom, symbolTypeAtom } from '../atoms';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { SymbolState } from '../helpers/symbolHelper';
import { useIsolatedNode } from './useIsoratedNode';
import { useNode } from './useNode';

export const useSymbol = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);
  const componentState = useRecoilValue(componentStateFamily(symbolType));
  const [symbolId, setSymbolId] = useRecoilState(symbolIdAtomFamily(componentState?.componentType));
  const previewSymbol = useRecoilValue(previewSymbolAtom);
  const { setNode, removeNode } = useNode();
  const { isIsolatedNode } = useIsolatedNode();

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      if (!componentState) return;
      const nodes = componentState.nodePoints.map((rp) => setNode(add(rp, point)));
      const sarr = symbols.get(componentState.componentType) ?? [];
      setSymbols(
        symbols.set(
          componentState.componentType,
          sarr.concat({
            type: symbolType,
            componentType: componentState.componentType,
            point,
            nodeIds: nodes,
            key: `${componentState.componentType}${symbolId}`,
            value: previewSymbol?.value ?? componentState.value ?? '',
            modelName: previewSymbol?.modelName ?? componentState.modelName ?? '',
            config: previewSymbol?.config ?? componentState.defaultConfig ?? [],
          })
        )
      );

      setSymbolId((prev) => prev + 1);
    },
    [
      componentState,
      symbols,
      setSymbols,
      symbolType,
      symbolId,
      previewSymbol?.value,
      previewSymbol?.modelName,
      previewSymbol?.config,
      setSymbolId,
      setNode,
    ]
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
