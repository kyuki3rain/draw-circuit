import { useCallback, useMemo } from 'react';
import { useRecoilState, atom } from 'recoil';
import { clone } from '../helpers/cloneHelper';
import { useView, ViewState } from './useView';

const logsAtom = atom({
  key: 'logs',
  default: [] as ViewState[],
});

const logIndexAtom = atom({
  key: 'logIndex',
  default: 0,
});

export const useLog = () => {
  const { getView, setView } = useView();
  const [logs, setLogs] = useRecoilState(logsAtom);
  const [logIndex, setLogIndex] = useRecoilState(logIndexAtom);

  const setLog = useCallback(() => {
    const view = getView();
    const newLogs = logs.slice(0, logIndex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    newLogs.push(clone(view));
    if (newLogs.length > 100) newLogs.shift();
    else setLogIndex((prev) => prev + 1);
    setLogs(newLogs);
  }, [getView, logIndex, logs, setLogIndex, setLogs]);

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

  return { undo, canUndo, redo, canRedo, logs, logIndex, setLog };
};

export default useLog;
