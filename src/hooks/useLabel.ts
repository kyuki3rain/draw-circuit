import { useCallback, useMemo } from 'react';

import { Mode } from '../helpers/modehelper';
import { nonNullable } from '../helpers/typeGuardHelper';
import { WireNode } from '../helpers/wireHelper';
import { useCursorPosition } from '../states/cursorPositionState';
import { useLabelPreview, useLabelState } from '../states/labelState';
import { useLog } from '../states/logState';
import { useMode } from '../states/modeState';
import { useNode } from '../states/nodeState';
import { useIsolatedNode } from './useIsoratedNode';

export const useLabel = () => {
  const { cursorPosition, setCursorPosition } = useCursorPosition();
  const { nodeList } = useNode();
  const { labelList, deleteLabel } = useLabelState();
  const { setLabelPreview } = useLabelPreview();
  const { isIsolatedNode } = useIsolatedNode();
  const { removeNode } = useNode();
  const { setLog } = useLog();
  const { mode, setCopyObjectType } = useMode();
  const { getLabelPreview } = useLabelPreview();

  const onClick = useCallback(
    (node: WireNode, label: string) => {
      switch (mode) {
        case Mode.CUT:
          deleteLabel(node.id);
          if (isIsolatedNode(node.id)) removeNode(node.id);

          setLog();
          break;
        case Mode.MOVE:
          deleteLabel(node.id);
          if (isIsolatedNode(node.id)) removeNode(node.id);

          setLog();
          setCopyObjectType(Mode.LABEL);
          setLabelPreview(label);
          setCursorPosition(node.point);
          break;
        case Mode.COPY:
          setCopyObjectType(Mode.LABEL);
          setLabelPreview(label);
          setCursorPosition(node.point);
          break;
        default:
      }
    },
    [deleteLabel, isIsolatedNode, mode, removeNode, setCopyObjectType, setCursorPosition, setLabelPreview, setLog]
  );

  const labelArray = useMemo(
    () =>
      Array.from(labelList.entries())
        .map(([nodeId, label]) => {
          const node = nodeList.get(nodeId);
          if (!node) return null;

          return {
            label,
            point: node.point,
            key: `label_${nodeId}`,
            onClick: () => onClick(node, label),
          };
        })
        .filter(nonNullable),
    [labelList, nodeList, onClick]
  );

  const previewLabel = useMemo(() => {
    const label = getLabelPreview();
    if (!label || !cursorPosition) return null;
    return {
      label,
      point: cursorPosition,
    };
  }, [cursorPosition, getLabelPreview]);

  return {
    labelArray,
    previewLabel,
  };
};
