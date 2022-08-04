/* eslint-disable no-console */
import { Fab, Tooltip } from '@mui/material';
import React from 'react';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import {
  Add,
  Description,
  HorizontalRule,
  Label,
  Save,
  Undo,
  Redo,
  TextFields,
  ContentCut,
  ContentCopy,
} from '@mui/icons-material';
import { labelModalAtom, logIndexAtom, logsAtom, modeAtom, modeSelector, textModalAtom, viewSelector } from '../atoms';
import { Mode } from '../helpers/modehelper';
import { netListSelector } from '../atoms/netListAtom';
import { useLog } from '../hooks/useLog';

const ButtonArea: React.FC = () => {
  const [mode, setMode] = useRecoilState(modeSelector);
  const setLabelModal = useSetRecoilState(labelModalAtom);
  const setTextModal = useSetRecoilState(textModalAtom);
  const { undo, canUndo, redo, canRedo } = useLog();
  const showNetList = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const netlist = snapshot.getLoadable(netListSelector).getValue();
        console.log(netlist);

        (async () => {
          const opts = {
            suggestedName: 'example',
            types: [
              {
                description: 'Text file',
                accept: { 'text/plain': ['.net'] },
              },
            ],
          };
          const handle = await window.showSaveFilePicker(opts);
          const writable = await handle.createWritable();
          await writable.write(netlist);
          await writable.close();
        })()
          .then(() => {})
          .catch(() => {});
      },
    []
  );
  const showInfo = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const view = snapshot.getLoadable(viewSelector).getValue();
        const logIndex = snapshot.getLoadable(logIndexAtom).getValue();
        const logs = snapshot.getLoadable(logsAtom).getValue();
        const modeInfo = snapshot.getLoadable(modeAtom).getValue();
        const netlist = snapshot.getLoadable(netListSelector).getValue();
        console.log('mode: ', modeInfo);
        console.log('view: ', view);
        console.log('logIndex: ', logIndex);
        console.log('logs: ', logs);
        console.log(netlist);
      },
    []
  );

  return (
    <div style={{ float: 'left', marginTop: 5 }}>
      <Tooltip title="wire" style={{ marginLeft: 5 }} arrow>
        <Fab aria-label="wire" color={mode === Mode.WIRE ? 'secondary' : 'primary'} onClick={() => setMode(Mode.WIRE)}>
          <HorizontalRule />
        </Fab>
      </Tooltip>
      <Tooltip title="symbol" style={{ marginLeft: 10 }} arrow>
        <Fab
          aria-label="symbol"
          color={mode === Mode.SYMBOL ? 'secondary' : 'primary'}
          onClick={() => setMode(Mode.SYMBOL)}
        >
          <Add />
        </Fab>
      </Tooltip>
      <Tooltip title="label" style={{ marginLeft: 10 }} arrow>
        <Fab
          color={mode === Mode.LABEL ? 'secondary' : 'primary'}
          aria-label="add label"
          onClick={() => {
            setMode(Mode.LABEL);
            setLabelModal(true);
          }}
        >
          <Label />
        </Fab>
      </Tooltip>
      <Tooltip title="text" style={{ marginLeft: 10 }} arrow>
        <Fab
          color={mode === Mode.TEXT ? 'secondary' : 'primary'}
          aria-label="add text"
          onClick={() => {
            setMode(Mode.TEXT);
            setTextModal(true);
          }}
        >
          <TextFields />
        </Fab>
      </Tooltip>
      <Tooltip title="cut" style={{ marginLeft: 10 }} arrow>
        <Fab
          color={mode === Mode.CUT ? 'secondary' : 'primary'}
          aria-label="cut"
          onClick={() => {
            setMode(Mode.CUT);
          }}
        >
          <ContentCut />
        </Fab>
      </Tooltip>
      <Tooltip title="copy" style={{ marginLeft: 10 }} arrow>
        <Fab
          color={mode === Mode.COPY ? 'secondary' : 'primary'}
          aria-label="copy"
          onClick={() => {
            setMode(Mode.COPY);
          }}
        >
          <ContentCopy />
        </Fab>
      </Tooltip>
      <Tooltip title="undo" style={{ marginLeft: 10 }} arrow>
        <Fab color="info" aria-label="undo" onClick={undo} disabled={!canUndo}>
          <Undo />
        </Fab>
      </Tooltip>
      <Tooltip title="redo" arrow style={{ marginLeft: 10 }}>
        <Fab color="info" aria-label="redo" onClick={redo} disabled={!canRedo}>
          <Redo />
        </Fab>
      </Tooltip>
      <Tooltip title="save as netlist" style={{ marginLeft: 10 }} arrow>
        <Fab color="info" aria-label="netlist" onClick={showNetList}>
          <Save />
        </Fab>
      </Tooltip>
      <Tooltip title="console log" style={{ marginLeft: 10 }} arrow>
        <Fab color={undefined} aria-label="get log" onClick={showInfo}>
          <Description />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default ButtonArea;
