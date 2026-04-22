import {
  withSpring,
  withTiming,
  withDelay,
  Easing,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import type {
  PresetConfig,
  PresetName,
  AltName,
  SpringConfig,
  TimingConfig,
  VariableTimingConfig,
} from './types';
import { resolvePreset } from './presets';

// ---------------------------------------------------------------------------
// Config converters
// ---------------------------------------------------------------------------

export function toSpringConfig(config: SpringConfig): WithSpringConfig {
  return {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
    overshootClamping: config.overshootClamping,
  };
}

const EASING_MAP = {
  'ease-out': Easing.out(Easing.ease),
  'ease-in-out': Easing.inOut(Easing.ease),
  linear: Easing.linear,
} as const;

export function toTimingConfig(
  config: TimingConfig | VariableTimingConfig,
  duration?: number
): WithTimingConfig {
  const d =
    duration ??
    (config.type === 'timing' ? config.duration : config.durationSmall);
  return {
    duration: d,
    easing: EASING_MAP[config.easing],
  };
}

// ---------------------------------------------------------------------------
// withMotion — the main API
// ---------------------------------------------------------------------------

type MotionOptions = {
  delay?: number;
  callback?: (finished?: boolean) => void;
};

/**
 * Drop-in replacement for `withSpring` / `withTiming` that reads from presets.
 *
 * For variable-duration presets (`change-state-color`, `loading`,
 * `loading-color`) this uses the small-object duration by default.
 * Use `withMotionForArea` for size-aware durations.
 */
export function withMotion(
  name: PresetName | AltName,
  toValue: number,
  options?: MotionOptions
) {
  const config = resolvePreset(name);
  const { delay = 0, callback } = options ?? {};

  let animation: ReturnType<typeof withSpring>;

  if (config.type === 'spring') {
    animation = withSpring(toValue, toSpringConfig(config), callback);
  } else {
    animation = withTiming(toValue, toTimingConfig(config), callback);
  }

  return delay > 0 ? withDelay(delay, animation) : animation;
}

// ---------------------------------------------------------------------------
// Variable-duration helpers
// ---------------------------------------------------------------------------

/**
 * Interpolate duration between small and large bounds based on element area.
 *
 * The spec ties duration to the visual weight of the element:
 *   - Small objects (icons, badges) get snappy transitions
 *   - Large objects (skeletons, full-width cards) get slower, gentler ones
 *
 * `areaSqPx` is the element's area in square pixels.
 * `screenArea` is the total screen area (defaults to 393 x 852 — iPhone 15 logical points).
 */
export function durationForArea(
  config: VariableTimingConfig,
  areaSqPx: number,
  screenArea = 393 * 852
): number {
  'worklet';
  const ratio = Math.min(areaSqPx / screenArea, 1);
  const { durationSmall, durationLarge } = config;
  return Math.round(durationSmall + ratio * (durationLarge - durationSmall));
}

/**
 * Create a timing animation whose duration scales with element area.
 */
export function withMotionForArea(
  name: 'change-state-color' | 'loading' | 'loading-color',
  toValue: number,
  areaSqPx: number,
  options?: MotionOptions & { screenArea?: number }
) {
  const config = resolvePreset(name) as VariableTimingConfig;
  const duration = durationForArea(config, areaSqPx, options?.screenArea);
  const { delay = 0, callback } = options ?? {};

  const animation = withTiming(
    toValue,
    { duration, easing: EASING_MAP[config.easing] },
    callback
  );

  return delay > 0 ? withDelay(delay, animation) : animation;
}
