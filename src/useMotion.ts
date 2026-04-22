import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { PresetName, AltName } from './types';
import { withMotion } from './animate';

type AnimatableProperty = 'opacity' | 'translateX' | 'translateY' | 'scale' | 'rotate';

type MotionValues = Partial<Record<AnimatableProperty, number>>;

type UseMotionOptions = {
  from: MotionValues;
  to: MotionValues;
  /** Start animating on mount. Defaults to true. */
  autoPlay?: boolean;
  delay?: number;
};

/**
 * Hook that drives animated values with a preset.
 *
 * ```tsx
 * const { animatedStyle, play, reset } = useMotion('move-in-sm', {
 *   from: { translateY: 50, opacity: 0 },
 *   to:   { translateY: 0,  opacity: 1 },
 * });
 *
 * return <Animated.View style={animatedStyle} />;
 * ```
 */
export function useMotion(
  preset: PresetName | AltName,
  options: UseMotionOptions
) {
  const { from, to, delay = 0 } = options;

  const progress: Record<string, ReturnType<typeof useSharedValue>> = {};
  const keys = Object.keys(from) as AnimatableProperty[];

  for (const key of keys) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    progress[key] = useSharedValue(from[key]!);
  }

  const play = useCallback(() => {
    for (const key of keys) {
      const target = to[key] ?? from[key]!;
      progress[key]!.value = withMotion(preset, target, { delay });
    }
  }, [preset, delay]);

  const reset = useCallback(() => {
    for (const key of keys) {
      progress[key]!.value = from[key]!;
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const style: Record<string, any> = {};
    const transform: { [k: string]: number }[] = [];

    for (const key of keys) {
      const val = progress[key]!.value;
      if (key === 'opacity') {
        style.opacity = val;
      } else if (key === 'scale') {
        transform.push({ scale: val });
      } else if (key === 'rotate') {
        transform.push({ rotate: `${val}deg` } as any);
      } else {
        transform.push({ [key]: val });
      }
    }

    if (transform.length > 0) {
      style.transform = transform;
    }
    return style;
  });

  if (options.autoPlay !== false) {
    setTimeout(play, 0);
  }

  return { animatedStyle, play, reset };
}
