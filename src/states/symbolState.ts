import { useCallback } from 'react';
import { atom, atomFamily, useRecoilState, useRecoilValue } from 'recoil';

import { ComponentName, ComponentType, ComponentTypes } from '../helpers/componentHelper';
import { add, VirtualPoint } from '../helpers/gridhelper';
import { SymbolState } from '../helpers/symbolHelper';
import { useComponent, useComponentStateFamily } from './componentState';
import { useNodeState } from './nodeState';

const symbolsAtom = atom({
  key: 'symbols',
  default: new Map() as Map<ComponentType, SymbolState[]>,
});

const symbolIdAtomFamily = atomFamily({
  key: 'symbolId',
  default: 1,
});

const previewSymbolAtom = atom({
  key: 'previewSymbol',
  default: null as SymbolState | null,
});

export const useSymbolState = () => {
  const previewSymbol = useRecoilValue(previewSymbolAtom);
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);
  const { componentState } = useComponent(previewSymbol?.componentName);
  const [symbolId, setSymbolId] = useRecoilState(symbolIdAtomFamily(componentState?.type));
  const { getOrCreateNode } = useNodeState();

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
    },
    [setSymbols]
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

  return { symbols, setSymbol, removeSymbol, updateSymbol };
};

export const useSymbolPreview = () => {
  const [symbol, setSymbol] = useRecoilState(previewSymbolAtom);
  const { getComponentStateFamily } = useComponentStateFamily();

  const getSymbolPreview = useCallback(() => symbol, [symbol]);
  const resetSymbolPreview = useCallback(() => setSymbol(null), [setSymbol]);
  const setSymbolPreview = useCallback((s: SymbolState) => setSymbol(s), [setSymbol]);
  const initializeSymbolPreview = useCallback(
    (cn: ComponentName) => {
      const componentState = getComponentStateFamily(cn);
      setSymbolPreview({
        componentName: cn,
        componentType: componentState?.type ?? ComponentTypes.ERROR,
        key: '',
        value: componentState?.defaultValue ?? '',
        modelName: componentState?.defaultModelName ?? '',
        config: componentState?.defaultConfig ?? [],
        nodeIds: [],
      });
    },
    [getComponentStateFamily, setSymbolPreview]
  );

  return {
    symbol,
    getSymbolPreview,
    resetSymbolPreview,
    initializeSymbolPreview,
    setSymbolPreview,
  };
};

export const useSymbolView = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsAtom);

  return {
    getSymbolView: useCallback(() => ({ symbols }), [symbols]),
    setSymbolView: useCallback(
      ({ symbolStates: newSymbolStates }: { symbolStates: Map<ComponentType, SymbolState[]> }) =>
        setSymbols(newSymbolStates),
      [setSymbols]
    ),
  };
};
