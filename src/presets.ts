import type { SpringConfig, TimingConfig, PresetConfig, PresetName, AltName } from './types';

// ---------------------------------------------------------------------------
// Spring presets
// ---------------------------------------------------------------------------

export const moveInSm: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 45,
  mass: 1,
  overshootClamping: false,
};

export const moveInMd: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 38,
  mass: 1,
  overshootClamping: false,
};

export const moveInLg: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 32,
  mass: 1,
  overshootClamping: false,
};

export const moveOutSm: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 48,
  mass: 1,
  overshootClamping: true,
};

export const moveOutMd: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 63,
  mass: 1,
  overshootClamping: true,
};

export const moveOutLg: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 57,
  mass: 1,
  overshootClamping: true,
};

export const changeStateSizeSm: SpringConfig = {
  type: 'spring',
  stiffness: 685,
  damping: 34,
  mass: 1,
  overshootClamping: false,
};

export const changeStateSizeMd: SpringConfig = {
  type: 'spring',
  stiffness: 685,
  damping: 34,
  mass: 1,
  overshootClamping: false,
};

// ---------------------------------------------------------------------------
// Timing presets
// ---------------------------------------------------------------------------

export const appear: TimingConfig = {
  type: 'timing',
  duration: 220,
  easing: 'ease',
};

export const disappear: TimingConfig = {
  type: 'timing',
  duration: 200,
  easing: 'ease-out',
};

export const changeStateColor: TimingConfig = {
  type: 'timing',
  duration: 200,
  easing: 'ease-in-out',
};

export const loading: TimingConfig = {
  type: 'timing',
  duration: 1000,
  easing: 'linear',
};

export const loadingColor: TimingConfig = {
  type: 'timing',
  duration: 200,
  easing: 'ease-in-out',
};

// ---------------------------------------------------------------------------
// Lookup maps
// ---------------------------------------------------------------------------

export const presets: Record<PresetName, PresetConfig> = {
  'move-in-sm': moveInSm,
  'move-in-md': moveInMd,
  'move-in-lg': moveInLg,
  'move-out-sm': moveOutSm,
  'move-out-md': moveOutMd,
  'move-out-lg': moveOutLg,
  'appear': appear,
  'disappear': disappear,
  'change-state-color': changeStateColor,
  'change-state-size-sm': changeStateSizeSm,
  'change-state-size-md': changeStateSizeMd,
  'loading': loading,
  'loading-color': loadingColor,
};

/** Fun alternate names from the design spec. */
const altNameMap: Record<AltName, PresetName> = {
  whooshle: 'move-in-sm',
  whooshdle: 'move-in-md',
  whooshddle: 'move-in-lg',
  whoosh: 'move-out-sm',
};

/**
 * Resolve a preset name (canonical or alt) to its config.
 * Throws if the name is unknown.
 */
export function resolvePreset(name: PresetName | AltName): PresetConfig {
  if (name in presets) {
    return presets[name as PresetName];
  }
  if (name in altNameMap) {
    return presets[altNameMap[name as AltName]];
  }
  throw new Error(`[motion] Unknown preset: "${name}"`);
}

/**
 * Returns a spring preset with an adjusted mass for a smoother bounce.
 * Tip from the design spec: increase mass up to 1.3 for a softer feel.
 */
export function withMass(
  name: PresetName | AltName,
  mass: number
): PresetConfig {
  const config = resolvePreset(name);
  if (config.type !== 'spring') {
    return config;
  }
  return { ...config, mass };
}
