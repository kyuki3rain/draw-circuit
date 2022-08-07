import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  copyObjectTypeAtom,
  previewLabelNameAtom,
  previewWirePointsAtom,
  previewSymbolAtom,
  previewTextAtom,
  selectedNodeIdAtom,
} from '../atoms';
import { cursorPositionAtom } from '../atoms/positionAtom';
import { VirtualPoint } from '../helpers/gridhelper';
import { Mode } from '../helpers/modehelper';

export const usePreview = () => {
  const setSelectedNodeId = useSetRecoilState(selectedNodeIdAtom);
  const setPreviewWirePoints = useSetRecoilState(previewWirePointsAtom);
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const setCursorPosition = useSetRecoilState(cursorPositionAtom);
  const setPreviewLabelName = useSetRecoilState(previewLabelNameAtom);
  const setPreviewText = useSetRecoilState(previewTextAtom);
  const setCopyObjectType = useSetRecoilState(copyObjectTypeAtom);

  const resetPreview = useCallback(() => {
    setSelectedNodeId(null);
    setPreviewWirePoints({ point1Relative: null, point2Relative: null });
    setPreviewSymbol(null);
    setPreviewLabelName('');
    setPreviewText(null);
    setCopyObjectType(Mode.NONE);
  }, [
    setSelectedNodeId,
    setPreviewWirePoints,
    setPreviewSymbol,
    setPreviewLabelName,
    setPreviewText,
    setCopyObjectType,
  ]);

  const setPreview = useCallback(
    (point: VirtualPoint) => {
      setCursorPosition(point);
    },
    [setCursorPosition]
  );

  return { setPreview, resetPreview };
};

export default usePreview;
