import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { textModalAtom, modeAtom, previewTextAtom } from '../atoms';
import { Mode } from '../helpers/modehelper';

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
  const [open, setOpen] = useRecoilState(textModalAtom);
  const [text, setText] = useRecoilState(previewTextAtom);
  const setMode = useSetRecoilState(modeAtom);
  const handleClose = () => {
    setOpen(false);
    if (!text || text.body === '') setMode(Mode.NONE);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            placeholder=".tran 0 1n 0 100f"
            label="SPICE DIRECTIVE or COMMENT"
            variant="standard"
            value={text?.body ?? ''}
            onChange={(e) =>
              setText((prev) => ({ body: e.target.value, isSpiceDirective: prev?.isSpiceDirective ?? false }))
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                aria-label="SPICE DIRECTIVE?"
                checked={text?.isSpiceDirective ?? false}
                onChange={(e) => setText((prev) => ({ body: prev?.body ?? '', isSpiceDirective: e.target.checked }))}
              />
            }
            label="SPICE DIRECTIVE?"
            labelPlacement="start"
          />

          <Button onClick={handleClose}>OK</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TextModal;
