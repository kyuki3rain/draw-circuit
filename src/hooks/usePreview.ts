import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  previewLabelNameAtom,
  previewPointsAtom,
  previewSymbolAtom,
  previewTextAtom,
  previewTextPositionAtom,
  selectedNodeIdAtom,
  componentNameAtom,
} from '../atoms';
import { positionAtom } from '../atoms/positionAtom';
import { ComponentName, ComponentTypes } from '../helpers/componentHelper';
import { add, sub, VirtualPoint } from '../helpers/gridhelper';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewPoints = useSetRecoilState(previewPointsAtom);
  const setComponentName = useSetRecoilState(componentNameAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setPosition = useSetRecoilState(positionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const setPreviewTextPosition = useSetRecoilState(previewTextPositionAtom);
  const [copyObjectType, setCopyObjectType] = useRecoilState(copyObjectTypeAtom);

  const resetPreview = useCallback(
    (mode: ModeType) => {
      switch (mode) {
        case Mode.WIRE:
          setSelectedNodeId(null);
          setPreviewPoints([null, null]);
          break;
        case Mode.SYMBOL:
          setComponentName('' as ComponentName);
          setPreviewSymbol(null);
          break;
        case Mode.LABEL:
          setPosition(null);
          setPreviewLabelName('');
          break;
        case Mode.TEXT:
          setPreviewText(null);
          setPreviewTextPosition(null);
          break;
        case Mode.MOVE:
        case Mode.COPY:
          setSelectedNodeId(null);
          setPreviewPoints([null, null, null]);
          setComponentName('' as ComponentName);
          setPreviewSymbol(null);
          setPosition(null);
          setPreviewLabelName('');
          setPreviewText(null);
          setPreviewTextPosition(null);
          setCopyObjectType(Mode.NONE);
          break;
        default:
      }
    },
    [
      setCopyObjectType,
      setPreviewLabelName,
      setPosition,
      setPreviewPoints,
      setPreviewSymbol,
      setPreviewText,
      setPreviewTextPosition,
      setSelectedNodeId,
      setComponentName,
    ]
  );

  const setPreview = useCallback(
    (mode: ModeType, point: VirtualPoint) => {
      switch (mode) {
        case Mode.WIRE:
          setPreviewPoints((prev) => [prev[0], point, null]);
          break;
        case Mode.SYMBOL:
          setPreviewSymbol((prev) => ({
            componentName: prev?.componentName ?? ('' as ComponentName),
            componentType: prev?.componentType ?? ComponentTypes.ERROR,
            point,
            key: `symbol_preview`,
            value: prev?.value ?? '',
            modelName: prev?.modelName ?? '',
            config: prev?.config ?? [],
            nodeIds: [],
          }));
          break;
        case Mode.LABEL:
          setPosition(point);
          break;
        case Mode.TEXT:
          setPreviewTextPosition(point);
          break;
        case Mode.MOVE:
        case Mode.COPY:
          switch (copyObjectType) {
            case Mode.WIRE:
              setPreviewPoints((prev) => [
                prev[0] && prev[2] && add(prev[0], sub(point, prev[2])),
                prev[1] && prev[2] && add(prev[1], sub(point, prev[2])),
                point,
              ]);
              break;
            case Mode.SYMBOL:
              setPreviewSymbol((prev) => ({
                componentName: prev?.componentName ?? ('' as ComponentName),
                componentType: prev?.componentType ?? ComponentTypes.ERROR,
                point,
                key: `symbol_preview`,
                value: prev?.value ?? '',
                modelName: prev?.modelName ?? '',
                config: prev?.config ?? [],
                nodeIds: [],
              }));
              break;
            case Mode.LABEL:
              setPosition(point);
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
    [copyObjectType, setPosition, setPreviewPoints, setPreviewSymbol, setPreviewTextPosition]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
