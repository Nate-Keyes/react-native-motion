export type SpringConfig = {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: number;
  overshootClamping: boolean;
  /** Approximate duration in ms (for reference — spring physics govern actual timing). */
  approximateDuration: number;
  /** Bounce factor used to derive stiffness/damping (0 = no bounce, 1 = infinite). */
  bounce: number;
};

export type TimingConfig = {
  type: 'timing';
  duration: number;
  easing: 'ease-out' | 'ease-in-out' | 'linear';
};

export type VariableTimingConfig = {
  type: 'variable-timing';
  durationSmall: number;
  durationLarge: number;
  easing: 'ease-in-out' | 'linear';
};

export type PresetConfig = SpringConfig | TimingConfig | VariableTimingConfig;

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
  | 'disappear';

export type VariableTimingPresetName =
  | 'change-state-color'
  | 'loading'
  | 'loading-color';

export type PresetName =
  | SpringPresetName
  | TimingPresetName
  | VariableTimingPresetName;

export type AltName =
  | 'whobble'
  | 'whoobble'
  | 'whooobble'
  | 'whosh'
  | 'whoosh'
  | 'whooosh'
  | 'loading-linear';
