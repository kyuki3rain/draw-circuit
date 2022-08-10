import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useState } from 'react';
import { Mode } from '../helpers/modehelper';
import { useTextPreview } from '../states/textState';
import { ModalTypes, useSingleModal } from '../states/modalState';
import { useMode } from '../states/modeState';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

const TextModal = () => {
  const { open, setClosed } = useSingleModal(ModalTypes.TEXT);
  const [text, setText] = useState('');
  const [isSpiceDirective, setIsSpiceDirective] = useState(false);
  const { initializeTextPreview } = useTextPreview();
  const { setMode } = useMode();
  const handleClose = (ok?: boolean) => {
    setClosed();
    if (!ok) setMode(Mode.NONE);
    else initializeTextPreview(text, isSpiceDirective);
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
            placeholder=".tran 0 1n 0 100f"
            label="SPICE DIRECTIVE or COMMENT"
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                aria-label="SPICE DIRECTIVE?"
                checked={isSpiceDirective}
                onChange={(e) => setIsSpiceDirective(e.target.checked)}
              />
            }
            label="SPICE DIRECTIVE?"
            labelPlacement="start"
          />

          <Button onClick={() => handleClose(true)}>OK</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TextModal;
