# Yahtzee Online — Neon Edition: Agent Context

## Project Overview

A Yahtzee web game with a neon/arcade aesthetic. Converted from Expo/React Native to Vite + React (web-only). Deployed to GitHub Pages at `https://thumnet.github.io/yahtzee/`.

## Commands

```bash
npm run dev      # dev server at http://localhost:8080/yahtzee/ (or next available port)
npm run build    # tsc -b && vite build  (type-check + bundle)
npm run preview  # serve dist/ locally — note: served at /yahtzee/, not /
```

## Stack

- **Vite 6** + **React 19** + **TypeScript 5** (strict)
- Zero runtime dependencies beyond React
- No router, no state management library, no CSS framework
- All styling: inline `style` props using pixel values from `src/utils/constants.ts`
- All global CSS (keyframes only) lives in `index.html`'s `<style>` block
- Audio: Web Audio API (`new Audio(...)`) — no library
- Storage: `localStorage` — no library

## Hard Rules

- No Expo, no React Native, no `react-native-web`
- No external CSS files, no CSS Modules, no Tailwind, no styled-components
- Use plain HTML elements (`div`, `span`, `button`) — never RN primitives
- Use inline `style` props — never `className` with external CSS
- Use `localStorage` — never `@react-native-async-storage`
- Use plain SVG JSX — never `react-native-svg`

## File Map

```
index.html              All @keyframes: confetti-fall, dice-roll-a–e, spin
main.tsx                ReactDOM.createRoot entry
App.tsx                 Screen router: splash → home → game → results
vite.config.ts          base: '/yahtzee/', publicDir: 'assets'
tsconfig.json           types: ['vite/client'] for import.meta.env

assets/
  audio/                roll.wav, select.wav, score.wav, yahtzee.wav
  favicon.svg / .png

src/
  types/index.ts        Die, ScoreCategory, Scorecard, GameState types
  utils/
    constants.ts        Colors, Spacing, FontSize, BorderRadius, game constants
    scoring.ts          All scoring logic (pure functions)
    storage.ts          localStorage wrappers (async API, sync implementation)
  contexts/
    SoundContext.tsx    Global isMuted state + toggleMute
  hooks/
    useGameState.ts     All game logic and state
    useSound.ts         Web Audio playback (respects isMuted)
    useHaptics.ts       No-op stubs (future mobile compatibility)
    useKeyboard.ts      window keydown listener with enabled flag
    useWindowDimensions.ts  window.resize listener → {width, height}
  components/
    Dice.tsx            Single die: CSS animation, face flicker, dot layout
    DiceTray.tsx        Row of 5 Dice components
    RollButton.tsx      Roll button + pip indicators
    Scorecard.tsx       Two-column scorecard, always compact=true
    ScorePopup.tsx      Floating +N animation (topPercent prop for stacking)
    Confetti.tsx        50 falling pieces, confetti-fall keyframe
    Logo.tsx            SVG logo (splash or small variant)
    ScreenManager.tsx   Cross-fade transition between screens
    ScreenTransition.tsx  (UNUSED — vestigial, do not delete but do not use)
    KeyboardHelpModal.tsx  Keyboard shortcut reference overlay
  screens/
    SplashScreen.tsx    1.6s auto-advancing splash
    HomeScreen.tsx      Menu with high score display
    GameScreen.tsx      Main game — dice, scorecard, all interactions
    ResultsScreen.tsx   Score reveal with count-up animation
```

## Architecture Decisions

### Navigation
Single `currentScreen` string in `App.tsx`. Screens are remounted on switch (no state preservation across screens). No React Router — back button does nothing. Direct URL access to a specific screen is not supported.

### Game State
All game logic is in `useGameState.ts`. `GameScreen` only handles UI concerns (sounds, animations, popups). `scoreCategory` in the hook guards on `rollsLeft === MAX_ROLLS` — scoring before rolling is impossible.

### Responsive Layout
`WIDE_SCREEN_BREAKPOINT = 768px`. Below: dice on top, scorecard below (vertical stack). Above: dice left, scorecard right (horizontal split, scorecard max-width 500px). `Scorecard` always uses two-column layout and always `compact = true` for row sizing regardless of screen size.

### Dice Animation
- Five CSS keyframe variants: `dice-roll-a` through `dice-roll-e`, selected by `die.id % 5`
- `--spin` CSS custom property set per-roll on the wrapper div (in `deg`, e.g. `"360deg"`)
- Keyframes read `var(--spin)` and `calc(var(--spin) * fraction)` for intermediate frames
- `animating` boolean state drives `shouldAnimate` — NOT `rollKey > 0` (avoids re-triggering on score)
- Wrapper `key={shouldAnimate ? rollKey : 'static'}` forces CSS animation restart on remount
- Face flicker: `displayValue` changes rapidly via `setTimeout` chain, slows quadratically, snaps to real value at end
- `isRolling → false` immediately clears all timers and snaps `displayValue` to `die.value`

### Confetti
- `--drift` is set as a **unitless number** (e.g. `"73.5"` not `"73.5px"`)
- Keyframe uses `calc(var(--drift, 0) * 1px)` — multiplying by `1px` gives it the unit
- If `--drift` has a `px` unit, `calc(Xpx * 1px)` is invalid CSS and the transform is discarded silently
- Container has `position: relative, overflow: hidden` — confetti div is `position: absolute, inset: 0`

### Score Popups
Two separate `ScorePopup` instances in `GameScreen`:
1. Regular score popup at `topPercent=40` — shows immediately on scoring
2. Bonus `+100` popup at `topPercent=52` — delayed 500ms via `bonusTimerRef`, fires as popup 1 starts exiting
Confetti for bonus Yahtzees is also delayed by the same 500ms so it coincides with the `+100` popup.

### Audio Paths
Audio files live in `assets/audio/*.wav`. `publicDir: 'assets'` means Vite copies them to `dist/` at the root level (without the `assets/` prefix). In `useSound.ts`, paths are `/audio/roll.wav` etc. — no `/assets/` prefix.

## Known Gotchas

### CSS Custom Properties with Units
Setting a CSS custom property with a unit AND using `calc(var(--x) * 1px)` in a keyframe is invalid. Always set custom properties as bare numbers and apply units in the keyframe. See `--drift` in `Confetti.tsx` and `--spin` in `Dice.tsx`.

### `scoreCategory` Dependency Array
`scoreCategory` in `useGameState` depends on the entire `gameState` object (`[gameState]`). This means it (and everything that depends on it) is recreated on every state change. Keyboard listeners re-register on every render. This is correct but inefficient — do not attempt to optimize without testing carefully.

### `ScreenManager` Children Churn
`ScreenManager`'s `useEffect` depends on `children`, which is a new React element reference every render. When `screenKey` is unchanged it calls `setCurrentScreen(children)` — a no-op state update. Do not add logic inside that branch.

### `isYahtzee` Duplication
`useGameState.scoreCategory` and `GameScreen.handleScoreCategory` both independently detect five-of-a-kind via `dice.every(d => d.value === dice[0].value)`. The hook uses it for bonus calculation; the screen uses it for sound/confetti. They must stay in sync.

### `forceYahtzee` in Production Bundle
`forceYahtzee` is always exported from `useGameState` (tree-shaking won't remove it as it's inside a hook). The debug button is gated by `import.meta.env.DEV` in JSX, so it's absent from the UI in production — but the function itself ships. This is acceptable.

### `isFullHouse` Does Not Match Yahtzee
Five-of-a-kind does not score as Full House. `getDiceCounts` returns a single entry with count `5`, which satisfies neither `values.includes(3)` nor `values.includes(2)`. This is correct per official rules.

### `base: '/yahtzee/'` and Local Preview
`npm run preview` serves at `http://localhost:8080/yahtzee/`, not the root. Navigate to that path, not `/`.

## Dead Code / Legacy Artifacts

These exist but are unused — do not delete without care, but do not reference or extend:

| Item | Location | Notes |
|---|---|---|
| `index.ts` | root | Expo entry point, not the Vite entry |
| `app.json` | root | Expo config |
| `GEMINI.md` | root | Outdated AI context doc from RN era |
| `Glow` constants | `constants.ts` | React Native shadow props, not valid web CSS |
| `ScreenTransition` | `src/components/` | Mount animation component, no screen uses it |
| `saveSettings/loadSettings` | `storage.ts` | Infrastructure exists, no UI calls it |
| `Player` type | `types/index.ts` | Multi-player scaffolding, never used |
| High Scores screen | — | `HomeScreen` has the button but `onClick` is a no-op |
| Game state persistence | `storage.ts` | `saveGameState`/`loadGameState` exist but are never called |
| Sound mute persistence | — | Mute state is in-memory only, resets on page reload |

## Deploy

GitHub Actions workflow at `.github/workflows/deploy.yml`. Triggers on push to `master`. Builds with `npm run build`, deploys `dist/` to GitHub Pages.

Repo: `ThumNet/yahtzee` → live at `https://thumnet.github.io/yahtzee/`

Enable Pages in repo Settings → Pages → Source: GitHub Actions (one-time setup).
