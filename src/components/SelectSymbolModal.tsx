import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Button, Select } from '@mui/material';
import SVG from 'react-inlinesvg';
import { useState } from 'react';
import { modeAtom, componentListAtom, selectSymbolModalAtom, componentStateFamily, previewSymbolAtom } from '../atoms';
import { Mode } from '../helpers/modehelper';
import { ComponentName, ComponentTypes } from '../helpers/componentHelper';

const style = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SelectSymbolModal = () => {
  const [open, setOpen] = useRecoilState(selectSymbolModalAtom);
  const [componentName, setComponentName] = useState('' as ComponentName);
  const componentList = useRecoilValue(componentListAtom);
  const setMode = useSetRecoilState(modeAtom);
  const componentState = useRecoilValue(componentStateFamily(componentName));
  const setPreviewSymbol = useSetRecoilState(previewSymbolAtom);
  const handleClose = (ok?: boolean) => {
    setOpen(false);
    if (!ok || componentName === '') setMode(Mode.NONE);
    else {
      setPreviewSymbol(() => ({
        componentName,
        componentType: componentState?.type ?? ComponentTypes.ERROR,
        key: '',
        value: componentState?.defaultValue ?? '',
        modelName: componentState?.defaultModelName ?? '',
        config: componentState?.defaultConfig ?? [],
        nodeIds: [],
      }));
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Select native value={componentName} onChange={(e) => setComponentName(e.target.value as ComponentName)}>
              <option key="null" value="">
                {null}
              </option>
              {componentList.map((cn) => (
                <option key={cn} value={cn}>
                  {cn}
                </option>
              ))}
            </Select>
            <Button onClick={() => handleClose(true)} style={{ marginTop: 10 }}>
              OK
            </Button>
          </div>
          <svg width="100" height="100">
            <SVG src={componentState?.svg ?? ''} />
          </svg>
        </Box>
      </Modal>
    </div>
  );
};

export default SelectSymbolModal;
