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
import { cursorPositionAtom } from '../atoms/positionAtom';
import { ComponentName, ComponentTypes } from '../helpers/componentHelper';
import { VirtualPoint } from '../helpers/gridhelper';
import { Mode, ModeType } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewWirePoints = useSetRecoilState(previewWirePointsAtom);
  const setComponentName = useSetRecoilState(componentNameAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setCursorPosition = useSetRecoilState(cursorPositionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const [copyObjectType, setCopyObjectType] = useRecoilState(copyObjectTypeAtom);

  const resetPreview = useCallback(
    (mode: ModeType) => {
      switch (mode) {
        case Mode.WIRE:
          setSelectedNodeId(null);
          setPreviewWirePoints({ point1Relative: null, point2Relative: null });
          break;
        case Mode.SYMBOL:
          setComponentName('' as ComponentName);
          setPreviewSymbol(null);
          break;
        case Mode.LABEL:
          setCursorPosition(null);
          setPreviewLabelName('');
          break;
        case Mode.TEXT:
          setPreviewText(null);
          setCursorPosition(null);
          break;
        case Mode.MOVE:
        case Mode.COPY:
          setSelectedNodeId(null);
          setPreviewWirePoints({ point1Relative: null, point2Relative: null });
          setComponentName('' as ComponentName);
          setPreviewSymbol(null);
          setCursorPosition(null);
          setPreviewLabelName('');
          setPreviewText(null);
          setCursorPosition(null);
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
      setCursorPosition,
      setPreviewLabelName,
      setPreviewText,
      setCopyObjectType,
    ]
  );

  const setPreview = useCallback(
    (mode: ModeType, point: VirtualPoint) => {
      switch (mode) {
        case Mode.WIRE:
          setCursorPosition(point);
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
          setCursorPosition(point);
          break;
        case Mode.TEXT:
          setCursorPosition(point);
          break;
        case Mode.MOVE:
        case Mode.COPY:
          switch (copyObjectType) {
            case Mode.WIRE:
              setCursorPosition(point);
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
              setCursorPosition(point);
              break;
            case Mode.TEXT:
              setCursorPosition(point);
              break;
            default:
          }
          break;
        default:
      }
    },
    [copyObjectType, setCursorPosition, setPreviewSymbol]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
