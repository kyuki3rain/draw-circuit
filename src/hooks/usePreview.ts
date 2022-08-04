import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  componentStateFamily,
  copyObjectTypeAtom,
  previewLabelNameAtom,
  previewLabelPositionAtom,
  previewPointsAtom,
  previewSymbolAtom,
  previewTextAtom,
  previewTextPositionAtom,
  selectedNodeIdAtom,
  symbolTypeAtom,
} from '../atoms';
import { ComponentTypes } from '../helpers/componentHelper';
import { add, sub, VirtualPoint } from '../helpers/gridhelper';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewPoints = useSetRecoilState(previewPointsAtom);
  const setSymbolType = useSetRecoilState(symbolTypeAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setPreviewLabelPosition = useSetRecoilState(previewLabelPositionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const setPreviewTextPosition = useSetRecoilState(previewTextPositionAtom);
  const symbolType = useRecoilValue(symbolTypeAtom);
  const componentState = useRecoilValue(componentStateFamily(symbolType));
  // const mode = useRecoilValue(modeAtom);
  const [copyObjectType, setCopyObjectType] = useRecoilState(copyObjectTypeAtom);

  const resetPreview = useCallback((mode: ModeType) => {
    switch (mode) {
      case Mode.WIRE:
        setSelectedNodeId(null);
        setPreviewPoints([null, null]);
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
      case Mode.COPY:
        console.log('escape from copy mode: ', copyObjectType);
        setSelectedNodeId(null);
        setPreviewPoints([null, null, null]);
        setSymbolType('cell');
        setPreviewSymbol(null);
        setPreviewLabelPosition(null);
        setPreviewLabelName('');
        setPreviewText(null);
        setPreviewTextPosition(null);
        setCopyObjectType(Mode.NONE);
        break;
      default:
    }
  }, []);

  const setPreview = useCallback(
    (mode: ModeType, point: VirtualPoint) => {
      switch (mode) {
        case Mode.WIRE:
          setPreviewPoints((prev) => [prev[0], point, null]);
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
        case Mode.COPY:
          console.log('copy object: ', copyObjectType);
          switch (copyObjectType) {
            case Mode.WIRE:
              setPreviewPoints((prev) => [
                prev[0] && prev[2] && add(prev[0], sub(point, prev[2])),
                prev[1] && prev[2] && add(prev[1], sub(point, prev[2])),
                point,
              ]);
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
          break;
        default:
      }
    },
    [
      componentState?.componentType,
      componentState?.defaultConfig,
      copyObjectType,
      setPreviewLabelPosition,
      setPreviewPoints,
      setPreviewSymbol,
      setPreviewTextPosition,
      symbolType,
    ]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
