import { atom, selector, useRecoilState } from 'recoil';

export const ModalTypes = {
  LABEL: 'label',
  TEXT: 'text',
  SYMBOL_SELECT: 'symbolSelect',
  SYMBOL_CONFIG: 'symbolConfig',
} as const;

export type ModalType = typeof ModalTypes[keyof typeof ModalTypes];

const labelModalAtom = atom({
  key: 'labelModal',
  default: false,
});
const textModalAtom = atom({
  key: 'textModal',
  default: false,
});

const symbolSelectModalAtom = atom({
  key: 'symbolSelectModal',
  default: false,
});

const symbolConfigModalAtom = atom({
  key: 'SymbolConfigModal',
  default: false,
});

export const modalSelector = selector({
  key: 'modal',
  get: ({ get }) =>
    get(labelModalAtom) || get(textModalAtom) || get(symbolSelectModalAtom) || get(symbolConfigModalAtom),
});

export const useModal = () => {
  const [openLabel, setOpenLabel] = useRecoilState(labelModalAtom);
  const [openText, setOpenText] = useRecoilState(textModalAtom);
  const [openSymbolSelect, setOpenSymbolSelect] = useRecoilState(symbolSelectModalAtom);
  const [openSymbolConfig, setOpenSymbolConfig] = useRecoilState(symbolConfigModalAtom);
  return {
    open: openLabel || openText || openSymbolSelect || openSymbolConfig,
    setOpen: (modalType: ModalType) => {
      switch (modalType) {
        case ModalTypes.LABEL:
          setOpenLabel(true);
          break;
        case ModalTypes.TEXT:
          setOpenText(true);
          break;
        case ModalTypes.SYMBOL_SELECT:
          setOpenSymbolSelect(true);
          break;
        case ModalTypes.SYMBOL_CONFIG:
          setOpenSymbolConfig(true);
          break;
        default:
      }
    },
    setClosed: (modalType: ModalType) => {
      switch (modalType) {
        case ModalTypes.LABEL:
          setOpenLabel(false);
          break;
        case ModalTypes.TEXT:
          setOpenText(false);
          break;
        case ModalTypes.SYMBOL_SELECT:
          setOpenSymbolSelect(false);
          break;
        case ModalTypes.SYMBOL_CONFIG:
          setOpenSymbolConfig(false);
          break;
        default:
      }
    },
  };
};

export const useSingleModal = (modalType: ModalType) => {
  const [openLabel, setOpenLabel] = useRecoilState(labelModalAtom);
  const [openText, setOpenText] = useRecoilState(textModalAtom);
  const [openSymbolSelect, setOpenSymbolSelect] = useRecoilState(symbolSelectModalAtom);
  const [openSymbolConfig, setOpenSymbolConfig] = useRecoilState(symbolConfigModalAtom);

  switch (modalType) {
    case ModalTypes.LABEL:
      return { open: openLabel, setOpen: () => setOpenLabel(true), setClosed: () => setOpenLabel(false) };
    case ModalTypes.TEXT:
      return { open: openText, setOpen: () => setOpenText(true), setClosed: () => setOpenText(false) };
    case ModalTypes.SYMBOL_SELECT:
      return {
        open: openSymbolSelect,
        setOpen: () => setOpenSymbolSelect(true),
        setClosed: () => setOpenSymbolSelect(false),
      };
    case ModalTypes.SYMBOL_CONFIG:
      return {
        open: openSymbolConfig,
        setOpen: () => setOpenSymbolConfig(true),
        setClosed: () => setOpenSymbolConfig(false),
      };
    default:
      return { open: false, setOpen: () => {}, setClosed: () => {} };
  }
};
