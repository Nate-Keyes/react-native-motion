// Presets
export {
  presets,
  resolvePreset,
  withMass,
  moveInSm,
  moveInMd,
  moveInLg,
  moveOutSm,
  moveOutMd,
  moveOutLg,
  appear,
  disappear,
  changeStateColor,
  changeStateSizeSm,
  changeStateSizeMd,
  loading,
  loadingColor,
} from './presets';

// Animation helpers
export {
  withMotion,
  withMotionForArea,
  durationForArea,
  toSpringConfig,
  toTimingConfig,
} from './animate';

// Hook
export { useMotion } from './useMotion';

// Component
export { MotionView } from './MotionView';
export type { MotionViewProps } from './MotionView';

// Types
export type {
  PresetConfig,
  SpringConfig,
  TimingConfig,
  VariableTimingConfig,
  PresetName,
  SpringPresetName,
  TimingPresetName,
  VariableTimingPresetName,
  AltName,
} from './types';
