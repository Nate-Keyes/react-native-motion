# react-native-motion

Curated animation presets for React Native, built on [Reanimated](https://docs.swmansion.com/react-native-reanimated/).

Every preset encodes a specific opinion: entrances have a subtle 0.15 bounce so elements feel alive. Exits are critically damped so they get out of the way. Larger objects move slower and heavier. The defaults are the design — you shouldn't need to tweak them.

## Install

```sh
npm install react-native-motion react-native-reanimated
```

Follow the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) if you haven't already.

## Presets

### Move In (spring, 0.15 bounce)

Elements entering the screen. The bounce gives a subtle sense of arrival — just enough to feel physical without being playful.

| Preset | Alt name | Usage | Stiffness | Damping | Mass | ~Duration |
|--------|----------|-------|-----------|---------|------|-----------|
| `move-in-sm` | `whobble` | < 1/8 screen | 815 | 48 | 1 | 220ms |
| `move-in-md` | `whoobble` | 1/8 – 2/3 screen | 504 | 38 | 1 | 280ms |
| `move-in-lg` | `whooobble` | > 2/3 screen | 342 | 31 | 1.3 | 340ms |

### Move Out (spring, 0 bounce)

Elements leaving the screen. Zero bounce, overshoot clamped — exits should never draw attention to themselves.

| Preset | Alt name | Usage | Stiffness | Damping | Mass | ~Duration |
|--------|----------|-------|-----------|---------|------|-----------|
| `move-out-sm` | `whosh` | < 1/3 screen | 1218 | 69 | 1 | 180ms |
| `move-out-md` | `whoosh` | 1/3 – 2/3 screen | 987 | 62 | 1 | 200ms |
| `move-out-lg` | `whooosh` | > 2/3 screen | 816 | 57 | 1 | 220ms |

### Appear / Disappear (timing, ease-out)

Opacity fades for elements that don't translate. Both use `ease-out` — the element responds immediately, then settles.

| Preset | Duration | Easing |
|--------|----------|--------|
| `appear` | 220ms | ease-out |
| `disappear` | 200ms | ease-out |

### State Change — Color / Opacity (variable timing)

Duration scales with element size. A small icon swapping color at 100ms feels instant. A full-screen skeleton at 2000ms feels gentle.

| Preset | Small | Large | Easing |
|--------|-------|-------|--------|
| `change-state-color` | 100ms | 2000ms | ease-in-out |

### State Change — Size (spring, 0.15 bounce)

| Preset | Usage | Stiffness | Damping | Mass | ~Duration |
|--------|-------|-----------|---------|------|-----------|
| `change-state-size-sm` | Incremental (sm→md, md→lg) | 685 | 44 | 1 | 240ms |
| `change-state-size-md` | Dramatic (sm→lg) | 342 | 31 | 1 | 340ms |

### Loading (variable timing)

| Preset | Alt name | Small | Large | Easing |
|--------|----------|-------|-------|--------|
| `loading` | `loading-linear` | 750ms | 2000ms | linear |
| `loading-color` | — | 100ms | 1500ms | ease-in-out |

## Usage

### `withMotion` — the main API

Drop-in replacement for `withSpring` / `withTiming`. Pass a preset name, get the right animation back.

```tsx
import { useSharedValue } from 'react-native-reanimated';
import { withMotion } from 'react-native-motion';

const translateY = useSharedValue(100);

// Animate with a named preset
translateY.value = withMotion('move-in-sm', 0);

// Alt names work too
translateY.value = withMotion('whobble', 0);

// With delay and callback
translateY.value = withMotion('move-in-sm', 0, {
  delay: 80,
  callback: (finished) => console.log('done', finished),
});
```

### `withMotionForArea` — size-aware timing

For presets where duration depends on element size (`change-state-color`, `loading`, `loading-color`), pass the element's area in square pixels. Duration interpolates between the small and large bounds.

```tsx
import { withMotionForArea } from 'react-native-motion';

// Small icon (24x24 = 576 sq px) — gets ~100ms
opacity.value = withMotionForArea('change-state-color', 1, 576);

// Full-width skeleton (393x200 = 78,600 sq px) — gets ~1600ms
opacity.value = withMotionForArea('change-state-color', 1, 78_600);
```

### `<MotionView>` — declarative component

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

### `useMotion` — imperative hook

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

### Raw configs

When you need to pass configs directly to Reanimated:

```tsx
import { withSpring } from 'react-native-reanimated';
import { presets, toSpringConfig } from 'react-native-motion';

const config = toSpringConfig(presets['move-in-sm']);
translateY.value = withSpring(0, config);
```

### Softer bounce with `withMass`

The spec recommends increasing mass up to 1.3 for a smoother bounce. `move-in-lg` already ships with mass 1.3 — use `withMass` to apply the same treatment to other presets.

```tsx
import { withMass, toSpringConfig } from 'react-native-motion';
import { withSpring } from 'react-native-reanimated';

const softer = withMass('move-in-sm', 1.2);
translateY.value = withSpring(0, toSpringConfig(softer));
```

## Design decisions

**Why springs for movement?** Springs are interruptible — if a user triggers a new animation mid-flight, the spring carries forward its current velocity instead of snapping. Timing-based animations restart from zero, which feels broken during rapid interactions.

**Why 0 bounce on exits?** Exit animations should never overshoot. An element sliding out then briefly sliding back in before disappearing draws the eye to something that should be invisible. Overshoot clamping ensures exits are clean.

**Why variable durations for color/loading?** A 100ms color fade on a 24px icon feels instant and responsive. The same 100ms on a full-screen skeleton would look like a flash. Duration must scale with visual weight.

**Why ease-out, not ease-in?** `ease-out` front-loads the movement — the element responds immediately, then settles. `ease-in` delays initial movement, which makes the interface feel sluggish at exactly the moment the user is watching most closely.

## API reference

| Export | Description |
|--------|-------------|
| `presets` | Record of all preset configs keyed by name |
| `resolvePreset(name)` | Resolve canonical or alt name to config |
| `withMotion(name, toValue, opts?)` | Create a Reanimated animation from a preset |
| `withMotionForArea(name, toValue, area, opts?)` | Size-aware variable-duration animation |
| `withMass(name, mass)` | Return a preset copy with adjusted mass |
| `toSpringConfig(config)` | Convert to Reanimated `WithSpringConfig` |
| `toTimingConfig(config)` | Convert to Reanimated `WithTimingConfig` |
| `durationForArea(config, area, screen?)` | Interpolate duration from element area |
| `useMotion(preset, opts)` | Hook returning `{ animatedStyle, play, reset }` |
| `MotionView` | Animated View component driven by a preset |

## License

MIT
