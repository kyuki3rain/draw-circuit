import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useSetRecoilState } from 'recoil';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { modeAtom } from '../atoms';
import { Mode } from '../helpers/modehelper';
import { useLabelPreview } from '../states/labelState';
import { ModalTypes, useSingleModal } from '../states/modalState';

const style = {
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

const LabelModal = () => {
  const { open, setClosed } = useSingleModal(ModalTypes.LABEL);
  const [label, setLabel] = useState('');
  const { initializeLabelPreview } = useLabelPreview();
  const setMode = useSetRecoilState(modeAtom);
  const handleClose = (ok?: boolean) => {
    setClosed();
    if (!ok) setMode(Mode.NONE);
    else initializeLabelPreview(label);
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
          <TextField
            placeholder="gnd"
            label="LABEL"
            variant="standard"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button onClick={() => handleClose(true)}>OK</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default LabelModal;
