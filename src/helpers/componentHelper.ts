import cell from '../assets/builtinComponents/SVG/CELL.svg';
import signal from '../assets/builtinComponents/SVG/SIGNAL.svg';
import nmos4 from '../assets/builtinComponents/SVG/NMOS4.svg';
import pmos4 from '../assets/builtinComponents/SVG/PMOS4.svg';
import { VirtualPoint } from './gridhelper';

export type ComponentState = {
  componentName: string;
  componentType: ComponentType;
  center: VirtualPoint;
  width: number;
  height: number;
  nodePoints: VirtualPoint[];
  svg: string;
  defaultConfig?: string;
};

export const ComponentTypes = {
  VOLTAGE: 'V',
  MOS: 'M',
  ERROR: 'error',
} as const;

export type ComponentType = typeof ComponentTypes[keyof typeof ComponentTypes];

export const builtinComponents = (cn: string): ComponentState | null => {
  switch (cn) {
    case 'cell':
      return {
        componentName: 'cell' as string,
        componentType: ComponentTypes.VOLTAGE,
        center: { vx: 2, vy: 2 },
        width: 4,
        height: 4,
        nodePoints: [
          { vx: 0, vy: -2 },
          { vx: 0, vy: 2 },
        ],
        svg: cell,
        defaultConfig: '1.8',
      };
    case 'signal':
      return {
        componentName: 'signal' as string,
        componentType: ComponentTypes.VOLTAGE,
        center: { vx: 2, vy: 2 },
        width: 4,
        height: 5,
        nodePoints: [
          { vx: 0, vy: -2 },
          { vx: 0, vy: 3 },
        ],
        svg: signal,
        defaultConfig: 'PULSE(0 1.8 50p 5p 5p 150p 300p)',
      };
    case 'nmos4':
      return {
        componentName: 'nmos4' as string,
        componentType: ComponentTypes.MOS,
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
        defaultConfig: 'N l=180n w=1u',
      };
    case 'pmos4':
      return {
        componentName: 'pmos4' as string,
        componentType: ComponentTypes.MOS,
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
        defaultConfig: 'P l=180n w=1u',
      };
    default:
      return null;
  }
};
