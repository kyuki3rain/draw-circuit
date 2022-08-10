import { useCallback } from 'react';
import { atom, atomFamily, selector, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { builtinComponentList, builtinComponents, ComponentName, ComponentState } from '../helpers/componentHelper';
import { add, VirtualPoint } from '../helpers/gridhelper';

const componentListAtom = atom({
  key: 'componentList',
  default: builtinComponentList,
});

const componentStateFamily = atomFamily({
  key: 'componentState',
  default: (componentName?: ComponentName) => {
    if (componentName) return builtinComponents(componentName);
    return null;
  },
});

const componentStatesSelector = selector({
  key: 'componentStates',
  get:
    ({ get }) =>
    (cn: ComponentName) =>
      get(componentStateFamily(cn)),
});

export const useComponentStateFamily = () => {
  const componentList = useRecoilValue(componentListAtom);
  const getComponentStateFamily = useRecoilValue(componentStatesSelector);

  const createComponentStateFamily = useRecoilCallback(
    ({ set }) =>
      (s: ComponentState) => {
        set(componentStateFamily(s.name), s);
        set(componentListAtom, (prev) => [...prev, s.name]);
      },
    []
  );

  const updateComponentStateFamily = useRecoilCallback(
    ({ set }) =>
      (s: ComponentState) => {
        if (getComponentStateFamily(s.name)) set(componentStateFamily(s.name), s);
      },
    [getComponentStateFamily]
  );

  const deleteComponentStateFamily = useRecoilCallback(
    ({ set, reset }) =>
      (cn: ComponentName) => {
        reset(componentStateFamily(cn));
        set(componentListAtom, (prev) => prev.filter((cl) => cl !== cn));
      },
    []
  );

  const getComponentNodePointsFamily = useCallback(
    (cn: ComponentName, point: VirtualPoint) => getComponentStateFamily(cn)?.nodePoints.map((p) => add(p, point)),
    [getComponentStateFamily]
  );

  return {
    componentList,
    getComponentStateFamily,
    createComponentStateFamily,
    updateComponentStateFamily,
    deleteComponentStateFamily,
    getComponentNodePointsFamily,
  };
};

export const useComponent = (cn?: ComponentName) => {
  const [componentState] = useRecoilState(componentStateFamily(cn));

  const getComponentNodePoints = useCallback(
    (point: VirtualPoint) => componentState?.nodePoints.map((np) => add(np, point)),
    [componentState?.nodePoints]
  );

  return {
    componentState,
    getComponentNodePoints,
  };
};
