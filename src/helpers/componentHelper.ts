import cell from '../assets/builtinComponents/SVG/CELL.svg';
import nmos4 from '../assets/builtinComponents/SVG/NMOS4.svg';
import pmos4 from '../assets/builtinComponents/SVG/PMOS4.svg';
import signal from '../assets/builtinComponents/SVG/SIGNAL.svg';
import { VirtualPoint } from './gridhelper';

export type ComponentState = {
  name: ComponentName;
  type: ComponentType;
  center: VirtualPoint;
  width: number;
  height: number;
  nodePoints: VirtualPoint[];
  svg: string;
  defaultValue?: string;
  defaultModelName?: string;
  defaultConfig?: { key: string; value: string; name: string }[];
};

export type ComponentName = string & { _brand: 'ComponentName' };

export const ComponentTypes = {
  VOLTAGE: 'V',
  MOS: 'M',
  ERROR: 'error',
} as const;

export type ComponentType = typeof ComponentTypes[keyof typeof ComponentTypes];

export const builtinComponentList = ['cell', 'signal', 'nmos4', 'pmos4'] as ComponentName[];

export const builtinComponents = (cn: string): ComponentState | null => {
  switch (cn) {
    case 'cell':
      return {
        name: 'cell' as ComponentName,
        type: ComponentTypes.VOLTAGE,
        center: { vx: 2, vy: 2 },
        width: 4,
        height: 4,
        nodePoints: [
          { vx: 0, vy: -2 },
          { vx: 0, vy: 2 },
        ],
        svg: cell,
        defaultValue: '1.8',
      };
    case 'signal':
      return {
        name: 'signal' as ComponentName,
        type: ComponentTypes.VOLTAGE,
        center: { vx: 2, vy: 2 },
        width: 4,
        height: 5,
        nodePoints: [
          { vx: 0, vy: -2 },
          { vx: 0, vy: 3 },
        ],
        svg: signal,
        defaultValue: 'PULSE(0 1.8 50p 5p 5p 150p 300p)',
      };
    case 'nmos4':
      return {
        name: 'nmos4' as ComponentName,
        type: ComponentTypes.MOS,
        center: { vx: 1, vy: 3 },
        width: 3,
        height: 6,
        nodePoints: [
          { vx: 2, vy: -3 },
          { vx: -1, vy: 2 },
          { vx: 2, vy: 3 },
          { vx: 2, vy: 0 },
        ],
        svg: nmos4,
        defaultModelName: 'NMOS',
        defaultConfig: [
          { key: 'l', value: '180n', name: 'length' },
          { key: 'w', value: '1u', name: 'width' },
        ],
      };
    case 'pmos4':
      return {
        name: 'pmos4' as ComponentName,
        type: ComponentTypes.MOS,
        center: { vx: 1, vy: 3 },
        width: 3,
        height: 6,
        nodePoints: [
          { vx: 2, vy: -3 },
          { vx: -1, vy: 2 },
          { vx: 2, vy: 3 },
          { vx: 2, vy: 0 },
        ],
        svg: pmos4,
        defaultModelName: 'PMOS',
        defaultConfig: [
          { key: 'l', value: '180n', name: 'length' },
          { key: 'w', value: '1u', name: 'width' },
        ],
      };
    default:
      return null;
  }
};
