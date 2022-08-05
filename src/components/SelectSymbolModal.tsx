import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Button, Select } from '@mui/material';
import SVG from 'react-inlinesvg';
import { modeAtom, symbolTypeAtom, componentListAtom, selectSymbolModalAtom, componentStateFamily } from '../atoms';
import { Mode } from '../helpers/modehelper';

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
  const [symbolType, setSymbolType] = useRecoilState(symbolTypeAtom);
  const componentList = useRecoilValue(componentListAtom);
  const setMode = useSetRecoilState(modeAtom);
  const componentState = useRecoilValue(componentStateFamily(symbolType));
  const handleClose = (ok?: boolean) => {
    setOpen(false);
    if (!ok || symbolType === '') setMode(Mode.NONE);
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
            <Select native value={symbolType} onChange={(e) => setSymbolType(e.target.value)}>
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
