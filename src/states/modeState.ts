import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';
import { Mode, ModeType } from '../helpers/modehelper';

const modeAtom = atom({
  key: 'mode',
  default: Mode.NONE as ModeType,
});

const copyObjectTypeAtom = atom({
  key: 'copyObjectType',
  default: Mode.NONE as ModeType,
});

export const useMode = () => {
  const [mode, setMode] = useRecoilState(modeAtom);
  const [copyObjectType, setCopyObjectType] = useRecoilState(copyObjectTypeAtom);

  const resetCopyObjecttype = useCallback(() => setCopyObjectType(Mode.NONE), [setCopyObjectType]);

  return {
    resetCopyObjecttype,
    mode,
    copyObjectType,
    setCopyObjectType,
    setMode,
  };
};
