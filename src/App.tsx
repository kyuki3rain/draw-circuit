import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Controller from './Controller';
import ButtonArea from './components/ButtonArea';
import DrawArea from './components/DrawArea';
import LabelModal from './components/LabelModal';
import TextModal from './components/TextModal';
import SelectSymbolModal from './components/SelectSymbolModal';
import SymbolConfigModal from './components/SymbolConfigModal';

const App: React.FC = () => (
  <RecoilRoot>
    <Controller>
      <ButtonArea />
      <DrawArea />
      <LabelModal />
      <TextModal />
      <SelectSymbolModal />
      <SymbolConfigModal />
    </Controller>
  </RecoilRoot>
);

export default App;
