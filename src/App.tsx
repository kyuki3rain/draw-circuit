import React from 'react';
import { RecoilRoot } from 'recoil';

import './App.css';
import Controller from './Controller';
import ButtonArea from './components/ButtonArea';
import DrawArea from './components/DrawArea';
import LabelModal from './components/LabelModal';
import SelectSymbolModal from './components/SelectSymbolModal';
import SymbolConfigModal from './components/SymbolConfigModal';
import TextModal from './components/TextModal';

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
