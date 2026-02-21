# Yahtzee Online - Project Context

## Overview
This is a browser-based Yahtzee dice game built with React Native for Web and Expo. Originally conceived as a mobile app, it has been pivoted to a web-first experience, optimized for both desktop and mobile browsers.

## Tech Stack
- **Framework:** React Native for Web (Expo SDK 54)
- **Language:** TypeScript
- **Styling:** React Native `StyleSheet` (Vanilla CSS-in-JS)
- **Animations:** React Native `Animated` API & `react-native-reanimated`
- **Audio:** `expo-av` (Web-compatible)
- **Haptics:** `expo-haptics` (Disabled on web)
- **Storage:** `localStorage` (via `@react-native-async-storage/async-storage` abstraction)

## Project Structure
- `src/components/`: Reusable UI components (Dice, Scorecard, etc.).
- `src/contexts/`: React Contexts (e.g., `SoundContext`).
- `src/hooks/`: Custom hooks for logic (`useGameState`, `useSound`, `useKeyboard`).
- `src/screens/`: Main application screens (`SplashScreen`, `HomeScreen`, `GameScreen`, `ResultsScreen`).
- `src/utils/`: Pure utility functions and constants.

## Key Architectural Patterns
- **Responsive Layout:** The `GameScreen` uses `useWindowDimensions` to switch between a mobile-stacked layout and a desktop-side-by-side layout.
- **Keyboard Support:** Full keyboard navigation (Space to roll, Enter to score, 1-5 for dice) is implemented for a native-feeling web experience.
- **State Management:** Core game state is managed by the `useGameState` hook.
- **Navigation:** A custom `ScreenManager` component handles screen transitions.

## Coding Conventions
- **Web Optimization:** Prioritize accessible web patterns and keyboard interactions.
- **Components:** Functional components with explicit prop types.
- **Styles:** Use constants from `src/utils/constants.ts`.

## Common Tasks
- **Start Development:** `npm start` (Runs in browser)
- **Build for Production:** `npm run build`
- **Add Sound:** Place `.wav` in `assets/audio/` and update `SoundContext.tsx`.
