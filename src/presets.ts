import type {
  SpringConfig,
  TimingConfig,
  VariableTimingConfig,
  PresetConfig,
  PresetName,
  AltName,
} from './types';

// ---------------------------------------------------------------------------
// Move In — spring entrances with 0.15 bounce
// ---------------------------------------------------------------------------

/** Objects smaller than 1/8 screen. */
export const moveInSm: SpringConfig = {
  type: 'spring',
  stiffness: 815,
  damping: 48,
  mass: 1,
  overshootClamping: false,
  approximateDuration: 220,
  bounce: 0.15,
};

/** Objects between 1/8 and 2/3 screen. */
export const moveInMd: SpringConfig = {
  type: 'spring',
  stiffness: 504,
  damping: 38,
  mass: 1,
  overshootClamping: false,
  approximateDuration: 280,
  bounce: 0.15,
};

/** Objects larger than 2/3 screen. */
export const moveInLg: SpringConfig = {
  type: 'spring',
  stiffness: 342,
  damping: 31,
  mass: 1.3,
  overshootClamping: false,
  approximateDuration: 340,
  bounce: 0.15,
};

// ---------------------------------------------------------------------------
// Move Out — critically-damped springs (0 bounce, overshoot clamped)
// ---------------------------------------------------------------------------

/** Objects smaller than 1/3 screen. */
export const moveOutSm: SpringConfig = {
  type: 'spring',
  stiffness: 1218,
  damping: 69,
  mass: 1,
  overshootClamping: true,
  approximateDuration: 180,
  bounce: 0,
};

/** Objects between 1/3 and 2/3 screen. */
export const moveOutMd: SpringConfig = {
  type: 'spring',
  stiffness: 987,
  damping: 62,
  mass: 1,
  overshootClamping: true,
  approximateDuration: 200,
  bounce: 0,
};

/** Objects larger than 2/3 screen. */
export const moveOutLg: SpringConfig = {
  type: 'spring',
  stiffness: 816,
  damping: 57,
  mass: 1,
  overshootClamping: true,
  approximateDuration: 220,
  bounce: 0,
};

// ---------------------------------------------------------------------------
// Appear / Disappear — timing-based opacity transitions
// ---------------------------------------------------------------------------

export const appear: TimingConfig = {
  type: 'timing',
  duration: 220,
  easing: 'ease-out',
};

export const disappear: TimingConfig = {
  type: 'timing',
  duration: 200,
  easing: 'ease-out',
};

// ---------------------------------------------------------------------------
// State Change — Color / Opacity (variable duration by element size)
// ---------------------------------------------------------------------------

export const changeStateColor: VariableTimingConfig = {
  type: 'variable-timing',
  durationSmall: 100,
  durationLarge: 2000,
  easing: 'ease-in-out',
};

// ---------------------------------------------------------------------------
// State Change — Size (spring)
// ---------------------------------------------------------------------------

/** Incremental size changes: sm→sm, md→md, lg→lg, sm→md, md→lg. */
export const changeStateSizeSm: SpringConfig = {
  type: 'spring',
  stiffness: 685,
  damping: 44,
  mass: 1,
  overshootClamping: false,
  approximateDuration: 240,
  bounce: 0.15,
};

/** Dramatic size change: sm→lg. */
export const changeStateSizeMd: SpringConfig = {
  type: 'spring',
  stiffness: 342,
  damping: 31,
  mass: 1,
  overshootClamping: false,
  approximateDuration: 340,
  bounce: 0.15,
};

// ---------------------------------------------------------------------------
// Loading — Movement (variable duration, linear)
// ---------------------------------------------------------------------------

export const loading: VariableTimingConfig = {
  type: 'variable-timing',
  durationSmall: 750,
  durationLarge: 2000,
  easing: 'linear',
};

// ---------------------------------------------------------------------------
// Loading — Color / Opacity (variable duration, ease-in-out)
// ---------------------------------------------------------------------------

export const loadingColor: VariableTimingConfig = {
  type: 'variable-timing',
  durationSmall: 100,
  durationLarge: 1500,
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

const altNameMap: Record<AltName, PresetName> = {
  whobble: 'move-in-sm',
  whoobble: 'move-in-md',
  whooobble: 'move-in-lg',
  whosh: 'move-out-sm',
  whoosh: 'move-out-md',
  whooosh: 'move-out-lg',
  'loading-linear': 'loading',
};

/**
 * Resolve a preset name (canonical or alt) to its config.
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
 * Returns a spring preset with an adjusted mass for a softer bounce.
 * From the spec: increase mass up to 1.3 for a smoother feel.
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
