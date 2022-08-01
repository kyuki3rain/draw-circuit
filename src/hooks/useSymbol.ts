import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { componentStateFamily, symbolsAtom, symbolTypeAtom } from '../atoms';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { useNode } from './useNode';

export const useSymbol = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);
  const componentState = useRecoilValue(componentStateFamily(symbolType));
  const { setNode } = useNode();

  const setSymbol = useCallback(
    (point: VirtualPoint) => {
      if (!componentState) return;
      const sarr = symbols.get(componentState.componentType) ?? [];
      setSymbols(
        symbols.set(
          componentState.componentType,
          sarr.concat({
            type: symbolType,
            point,
            key: `symbol_${componentState.componentType}${sarr.length}`,
            config: componentState.defaultConfig ?? '',
          })
        )
      );
      componentState.nodes.map((rp) => setNode(add(rp, point)));
    },
    [symbols, symbolType]
  );

  return { setSymbol };
};

export default useSymbol;
