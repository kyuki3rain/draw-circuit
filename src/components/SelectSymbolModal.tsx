import { Button, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import SVG from 'react-inlinesvg';

import { ComponentName } from '../helpers/componentHelper';
import { Mode } from '../helpers/modehelper';
import { useComponent, useComponentStateFamily } from '../states/componentState';
import { ModalTypes, useSingleModal } from '../states/modalState';
import { useMode } from '../states/modeState';
import { useSymbolPreview } from '../states/symbolState';

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
  const [componentName, setComponentName] = useState('' as ComponentName);
  const { open, setClosed } = useSingleModal(ModalTypes.SYMBOL_SELECT);
  const { setMode } = useMode();
  const { componentList } = useComponentStateFamily();
  const { componentState } = useComponent(componentName);
  const { initializeSymbolPreview } = useSymbolPreview();
  const handleClose = (ok?: boolean) => {
    setClosed();
    if (!ok || componentName === '') setMode(Mode.NONE);
    else {
      initializeSymbolPreview(componentName);
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
