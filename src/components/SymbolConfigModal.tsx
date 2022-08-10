import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { useLog } from '../states/logState';
import { ModalTypes, useSingleModal } from '../states/modalState';
import { useSymbol } from '../states/symbolState';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
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

const SymbolConfigModal = () => {
  const { open, params: configSymbol, setClosed } = useSingleModal(ModalTypes.SYMBOL_CONFIG);
  const { updateSymbol } = useSymbol();
  const [state, setState] = useState(new Map() as Map<string, string>);
  const { setLog } = useLog();

  const handleClose = () => {
    setClosed();
    setState(new Map());
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="value"
            variant="outlined"
            value={state.get('value') ?? configSymbol?.value ?? ''}
            onChange={(e) => {
              setState((prev) => new Map(prev.set('value', e.target.value)));
            }}
          />
          <TextField
            label="modelName"
            variant="outlined"
            value={state.get('modelName') ?? configSymbol?.modelName ?? ''}
            onChange={(e) => {
              setState((prev) => new Map(prev.set('modelName', e.target.value)));
            }}
          />
          {configSymbol?.config &&
            configSymbol.config.map((config) => (
              <TextField
                label={config.name}
                variant="outlined"
                key={`${configSymbol?.key ?? ''}_${config.key}`}
                value={state.get(config.name) ?? config.value ?? ''}
                onChange={(e) => {
                  setState((prev) => new Map(prev.set(config.name, e.target.value)));
                }}
              />
            ))}
          <Button
            onClick={() => {
              if (!configSymbol) return;
              updateSymbol({
                ...configSymbol,
                value: state.get('value') ?? configSymbol.value,
                modelName: state.get('modelName') ?? configSymbol.modelName,
                config:
                  configSymbol.config.map((config) => ({
                    value: state.get(config.name) ?? config.value,
                    name: config.name,
                    key: config.key,
                  })) ?? [],
              });
              setLog();
              handleClose();
            }}
            style={{ marginTop: 10 }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SymbolConfigModal;
