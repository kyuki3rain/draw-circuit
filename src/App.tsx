import React from 'react';
import './App.css';
import { RecoilRoot } from 'recoil';
import Controller from './Controller';
import ButtonArea from './components/ButtonArea';
import DrawArea from './components/DrawArea';
import LabelModal from './components/LabelModal';
import TextModal from './components/TextModal';
import SelectSymbolModal from './components/SelectSymbolModal';

const App: React.FC = () => (
  <RecoilRoot>
    <Controller>
      <ButtonArea />
      <DrawArea />
      <LabelModal />
      <TextModal />
      <SelectSymbolModal />
    </Controller>
  </RecoilRoot>
);

export default App;
