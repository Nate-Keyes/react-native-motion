import React, { useEffect, useRef } from 'react';
import type { ViewStyle, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import type { PresetName, AltName } from './types';
import { withMotion } from './animate';

type AnimatableValues = {
  opacity?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
  rotate?: number;
};

export type MotionViewProps = ViewProps & {
  /** The animation preset to use. */
  preset?: PresetName | AltName;
  /** Starting values. */
  from?: AnimatableValues;
  /** Target values. */
  to?: AnimatableValues;
  /** Delay in ms before the animation starts. */
  delay?: number;
  /** Whether to animate on mount. Defaults to true. */
  autoPlay?: boolean;
  /** Called when the animation finishes. */
  onComplete?: () => void;
  style?: ViewStyle;
};

/**
 * A thin wrapper around `Animated.View` that animates between `from` and `to`
 * values using the given preset.
 *
 * ```tsx
 * <MotionView
 *   preset="move-in-sm"
 *   from={{ translateY: 50, opacity: 0 }}
 *   to={{ translateY: 0, opacity: 1 }}
 * >
 *   <Text>Hello</Text>
 * </MotionView>
 * ```
 */
export function MotionView({
  preset = 'move-in-sm',
  from = {},
  to = {},
  delay = 0,
  autoPlay = true,
  onComplete,
  style,
  children,
  ...rest
}: MotionViewProps) {
  const opacity = useSharedValue(from.opacity ?? 1);
  const translateX = useSharedValue(from.translateX ?? 0);
  const translateY = useSharedValue(from.translateY ?? 0);
  const scale = useSharedValue(from.scale ?? 1);
  const rotate = useSharedValue(from.rotate ?? 0);

  const hasPlayed = useRef(false);

  const animateTo = (values: AnimatableValues) => {
    const keys = Object.keys(values) as (keyof AnimatableValues)[];
    const sharedValues = { opacity, translateX, translateY, scale, rotate };

    keys.forEach((key, i) => {
      const isLast = i === keys.length - 1;
      const cb = isLast && onComplete
        ? (finished?: boolean) => {
            'worklet';
            if (finished && onComplete) runOnJS(onComplete)();
          }
        : undefined;

      sharedValues[key].value = withMotion(preset, values[key]!, {
        delay,
        callback: cb,
      });
    });
  };

  useEffect(() => {
    if (autoPlay && !hasPlayed.current) {
      hasPlayed.current = true;
      animateTo(to);
    }
  }, [autoPlay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
