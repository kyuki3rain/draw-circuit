import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  componentStateFamily,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  previewPointAtom,
  previewSymbolAtom,
  selectedNodeIdAtom,
  symbolTypeAtom,
} from '../atoms';
import { VirtualPoint } from '../helpers/gridhelper';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewPoint = useSetRecoilState(previewPointAtom);
  const setSymbolType = useSetRecoilState(symbolTypeAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setPreviewLabelPosition = useSetRecoilState(previewLabelPositionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);
  const componentState = useRecoilValue(componentStateFamily(symbolType));

  const resetPreview = useCallback((mode: ModeType) => {
    switch (mode) {
      case Mode.WIRE:
        setSelectedNodeId(null);
        setPreviewPoint({} as VirtualPoint);
        break;
      case Mode.SYMBOL:
        setSymbolType('cell');
        setPreviewSymbol(null);
        break;
      case Mode.LABEL:
        setPreviewLabelPosition(null);
        setPreviewLabelName('');
        break;
      default:
    }
  }, []);

  const setPreview = useCallback(
    (mode: ModeType, point: VirtualPoint) => {
      switch (mode) {
        case Mode.WIRE:
          setPreviewPoint(point);
          break;
        case Mode.SYMBOL:
          setPreviewSymbol({
            type: symbolType,
            point,
            key: `symbol_preview`,
            config: componentState?.defaultConfig ?? '',
          });
          break;
        case Mode.LABEL:
          setPreviewLabelPosition(point);
          break;
        default:
      }
    },
    [symbolType]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
