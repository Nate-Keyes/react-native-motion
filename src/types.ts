import type { EasingFunction } from 'react-native-reanimated';

export type SpringConfig = {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: number;
  overshootClamping: boolean;
};

export type TimingConfig = {
  type: 'timing';
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
};

export type PresetConfig = SpringConfig | TimingConfig;

export type SpringPresetName =
  | 'move-in-sm'
  | 'move-in-md'
  | 'move-in-lg'
  | 'move-out-sm'
  | 'move-out-md'
  | 'move-out-lg'
  | 'change-state-size-sm'
  | 'change-state-size-md';

export type TimingPresetName =
  | 'appear'
  | 'disappear'
  | 'change-state-color'
  | 'loading'
  | 'loading-color';

export type PresetName = SpringPresetName | TimingPresetName;

export type AltName =
  | 'whooshle'
  | 'whooshdle'
  | 'whooshddle'
  | 'whoosh';

export type MotionViewProps = {
  preset?: PresetName | AltName;
  from?: Record<string, number>;
  to?: Record<string, number>;
  autoPlay?: boolean;
  delay?: number;
  onComplete?: () => void;
  children?: React.ReactNode;
  style?: any;
};
