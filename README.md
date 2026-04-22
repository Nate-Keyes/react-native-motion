# react-native-motion

Curated animation presets for React Native, built on [Reanimated](https://docs.swmansion.com/react-native-reanimated/).

## Install

```sh
npm install react-native-motion react-native-reanimated
```

Follow the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) if you haven't already.

## Presets

| Name | Alt name | Curve | Parameters |
|------|----------|-------|------------|
| `move-in-sm` | whooshle | spring | stiffness: 200, damping: 45 |
| `move-in-md` | whooshdle | spring | stiffness: 200, damping: 38 |
| `move-in-lg` | whooshddle | spring | stiffness: 200, damping: 32 |
| `move-out-sm` | whoosh | spring | damping: 48, overshoot clamped |
| `move-out-md` | — | spring | damping: 63, overshoot clamped |
| `move-out-lg` | — | spring | damping: 57, overshoot clamped |
| `appear` | — | ease | 220 ms |
| `disappear` | — | ease-out | 200 ms |
| `change-state-color` | — | ease-in-out | variable duration |
| `change-state-size-sm` | — | spring | stiffness: 685, damping: 34 |
| `change-state-size-md` | — | spring | stiffness: 685, damping: 34 |
| `loading` | — | linear | variable duration |
| `loading-color` | — | ease-in-out | variable duration |

> **Tip:** For a softer bounce on any spring preset, increase mass up to 1.3 using `withMass('move-in-sm', 1.3)`.

## Usage

### Drop-in animation function

Use `withMotion` anywhere you'd use `withSpring` or `withTiming`:

```tsx
import { useSharedValue } from 'react-native-reanimated';
import { withMotion } from 'react-native-motion';

const translateY = useSharedValue(100);

// Animate to 0 using the move-in-sm spring preset
translateY.value = withMotion('move-in-sm', 0);

// With delay and callback
translateY.value = withMotion('move-in-sm', 0, {
  delay: 100,
  callback: (finished) => { console.log('done', finished); },
});

// Alt names work too
translateY.value = withMotion('whooshle', 0);
```

### `<MotionView>` component

```tsx
import { MotionView } from 'react-native-motion';

<MotionView
  preset="move-in-sm"
  from={{ translateY: 50, opacity: 0 }}
  to={{ translateY: 0, opacity: 1 }}
>
  <Text>Hello</Text>
</MotionView>
```

### `useMotion` hook

```tsx
import Animated from 'react-native-reanimated';
import { useMotion } from 'react-native-motion';

function Card() {
  const { animatedStyle, play, reset } = useMotion('move-in-md', {
    from: { translateY: 80, opacity: 0 },
    to:   { translateY: 0,  opacity: 1 },
  });

  return <Animated.View style={animatedStyle} />;
}
```

### Raw preset configs

Access the underlying Reanimated configs directly:

```tsx
import { withSpring } from 'react-native-reanimated';
import { presets, toSpringConfig } from 'react-native-motion';

const config = toSpringConfig(presets['move-in-sm']);
translateY.value = withSpring(0, config);
```

### Variable-duration presets

For `change-state-color`, `loading`, and `loading-color`, duration depends on element size:

```tsx
import { withMotionForArea } from 'react-native-motion';

// Pass the element's area in square pixels
opacity.value = withMotionForArea('change-state-color', 1, 200);
```

## API

| Export | Description |
|--------|-------------|
| `presets` | Record of all preset configs keyed by name |
| `resolvePreset(name)` | Resolve a canonical or alt name to its config |
| `withMotion(name, toValue, opts?)` | Create a Reanimated animation from a preset |
| `withMotionForArea(name, toValue, area, opts?)` | Variable-duration timing animation |
| `withMass(name, mass)` | Return a preset with adjusted mass |
| `toSpringConfig(config)` | Convert a spring preset to a Reanimated `WithSpringConfig` |
| `toTimingConfig(config)` | Convert a timing preset to a Reanimated `WithTimingConfig` |
| `durationForArea(areaSqPx)` | Calculate duration from element area |
| `useMotion(preset, opts)` | Hook returning `{ animatedStyle, play, reset }` |
| `MotionView` | Animated View component with preset prop |

## License

MIT
