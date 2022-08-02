import { useCallback, useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { logIndexAtom, logsAtom, viewSelector } from '../atoms/viewSelector';

export const useLog = () => {
  const setView = useSetRecoilState(viewSelector);
  const [logs] = useRecoilState(logsAtom);
  const [logIndex, setLogIndex] = useRecoilState(logIndexAtom);

  const undo = useCallback(() => {
    const nextIndex = logIndex - 1;
    setView(logs[nextIndex - 1]);
    setLogIndex(nextIndex);
  }, [logIndex, logs, setLogIndex, setView]);
  const canUndo = useMemo(() => logIndex > 1, [logIndex]);

  const redo = useCallback(() => {
    const nextIndex = logIndex + 1;
    setView(logs[nextIndex - 1]);
    setLogIndex(nextIndex);
  }, [logIndex, logs, setLogIndex, setView]);
  const canRedo = useMemo(() => logIndex < logs.length, [logIndex, logs]);

  return { undo, canUndo, redo, canRedo };
};

export default useLog;
