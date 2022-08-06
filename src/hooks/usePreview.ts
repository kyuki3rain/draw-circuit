import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  previewLabelNameAtom,
  previewWirePointsAtom,
  previewSymbolAtom,
  previewTextAtom,
  selectedNodeIdAtom,
  componentNameAtom,
} from '../atoms';
import { positionAtom } from '../atoms/positionAtom';
import { ComponentName, ComponentTypes } from '../helpers/componentHelper';
import { add, sub, VirtualPoint } from '../helpers/gridhelper';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewWirePoints = useSetRecoilState(previewWirePointsAtom);
  const setComponentName = useSetRecoilState(componentNameAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setPosition = useSetRecoilState(positionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const [copyObjectType, setCopyObjectType] = useRecoilState(copyObjectTypeAtom);

  const resetPreview = useCallback(
    (mode: ModeType) => {
      switch (mode) {
        case Mode.WIRE:
          setSelectedNodeId(null);
          setPreviewWirePoints({ point1: null, point2: null, prevCursorPoint: null });
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
          setPosition(null);
          break;
        case Mode.MOVE:
        case Mode.COPY:
          setSelectedNodeId(null);
          setPreviewWirePoints({ point1: null, point2: null, prevCursorPoint: null });
          setComponentName('' as ComponentName);
          setPreviewSymbol(null);
          setPosition(null);
          setPreviewLabelName('');
          setPreviewText(null);
          setPosition(null);
          setCopyObjectType(Mode.NONE);
          break;
        default:
      }
    },
    [
      setSelectedNodeId,
      setPreviewWirePoints,
      setComponentName,
      setPreviewSymbol,
      setPosition,
      setPreviewLabelName,
      setPreviewText,
      setCopyObjectType,
    ]
  );

  const setPreview = useCallback(
    (mode: ModeType, point: VirtualPoint) => {
      switch (mode) {
        case Mode.WIRE:
          setPreviewWirePoints((prev) => ({ point1: prev.point1, point2: point, prevCursorPoint: null }));
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
          setPosition(point);
          break;
        case Mode.MOVE:
        case Mode.COPY:
          switch (copyObjectType) {
            case Mode.WIRE:
              setPreviewWirePoints((prev) => ({
                point1: prev.point1 && prev.prevCursorPoint && add(prev.point1, sub(point, prev.prevCursorPoint)),
                point2: prev.point2 && prev.prevCursorPoint && add(prev.point2, sub(point, prev.prevCursorPoint)),
                prevCursorPoint: point,
              }));
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
              setPosition(point);
              break;
            default:
          }
          break;
        default:
      }
    },
    [copyObjectType, setPosition, setPreviewSymbol, setPreviewWirePoints]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
