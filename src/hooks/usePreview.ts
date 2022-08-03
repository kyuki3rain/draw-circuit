import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  componentStateFamily,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  previewPointAtom,
  previewSymbolAtom,
  previewTextAtom,
  previewTextPositionAtom,
  selectedNodeIdAtom,
  symbolTypeAtom,
} from '../atoms';
import { ComponentTypes } from '../helpers/componentHelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewPoint = useSetRecoilState(previewPointAtom);
  const setSymbolType = useSetRecoilState(symbolTypeAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setPreviewLabelPosition = useSetRecoilState(previewLabelPositionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const setPreviewTextPosition = useSetRecoilState(previewTextPositionAtom);
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
      case Mode.TEXT:
        setPreviewText(null);
        setPreviewTextPosition(null);
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
            componentType: componentState?.componentType ?? ComponentTypes.ERROR,
            point,
            key: `symbol_preview`,
            config: componentState?.defaultConfig ?? '',
            nodeIds: [],
          });
          break;
        case Mode.LABEL:
          setPreviewLabelPosition(point);
          break;
        case Mode.TEXT:
          setPreviewTextPosition(point);
          break;
        default:
      }
    },
    [symbolType]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
