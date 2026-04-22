import {
  withSpring,
  withTiming,
  withDelay,
  Easing,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import type { PresetConfig, PresetName, AltName, TimingConfig } from './types';
import { resolvePreset } from './presets';

// ---------------------------------------------------------------------------
// Config converters – turn our preset objects into Reanimated configs
// ---------------------------------------------------------------------------

export function toSpringConfig(config: PresetConfig): WithSpringConfig {
  if (config.type !== 'spring') {
    throw new Error('[motion] Expected a spring preset');
  }
  return {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
    overshootClamping: config.overshootClamping,
  };
}

const EASING_MAP = {
  ease: Easing.ease,
  'ease-in': Easing.in(Easing.ease),
  'ease-out': Easing.out(Easing.ease),
  'ease-in-out': Easing.inOut(Easing.ease),
  linear: Easing.linear,
} as const;

export function toTimingConfig(config: PresetConfig): WithTimingConfig {
  if (config.type !== 'timing') {
    throw new Error('[motion] Expected a timing preset');
  }
  return {
    duration: config.duration,
    easing: EASING_MAP[config.easing],
  };
}

// ---------------------------------------------------------------------------
// withMotion – drop-in replacement for withSpring / withTiming
// ---------------------------------------------------------------------------

export function withMotion(
  name: PresetName | AltName,
  toValue: number,
  options?: { delay?: number; callback?: (finished?: boolean) => void }
) {
  const config = resolvePreset(name);
  const { delay = 0, callback } = options ?? {};

  let animation: ReturnType<typeof withSpring>;

  if (config.type === 'spring') {
    animation = withSpring(toValue, toSpringConfig(config), callback);
  } else {
    animation = withTiming(toValue, toTimingConfig(config), callback);
  }

  if (delay > 0) {
    return withDelay(delay, animation);
  }
  return animation;
}

// ---------------------------------------------------------------------------
// Duration helpers for variable-duration presets
// ---------------------------------------------------------------------------

/**
 * Calculate a duration for size-dependent presets (change-state-color,
 * loading-color) based on the area of the element in square pixels.
 *
 * Follows the design spec guidance:
 *   - small objects (≤ 100 sq px) → 100 ms
 *   - medium objects (~250 sq px) → 150 ms
 *   - larger objects (≤ 2500 sq px) → 200 ms
 *   - very large objects → up to 300 ms
 */
export function durationForArea(areaSqPx: number): number {
  'worklet';
  if (areaSqPx <= 100) return 100;
  if (areaSqPx <= 250) return 150;
  if (areaSqPx <= 2500) return 200;
  return 300;
}

/**
 * Create a timing animation with a variable duration based on element area.
 */
export function withMotionForArea(
  name: 'change-state-color' | 'loading' | 'loading-color',
  toValue: number,
  areaSqPx: number,
  options?: { delay?: number; callback?: (finished?: boolean) => void }
) {
  const config = resolvePreset(name) as TimingConfig;
  const duration = durationForArea(areaSqPx);
  const { delay = 0, callback } = options ?? {};

  const animation = withTiming(
    toValue,
    { duration, easing: EASING_MAP[config.easing] },
    callback
  );

  if (delay > 0) {
    return withDelay(delay, animation);
  }
  return animation;
}
