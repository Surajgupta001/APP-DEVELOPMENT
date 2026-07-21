# MotionFlix 🎬

MotionFlix is a premium, high-fidelity movie browsing application built using **React Native**, **Expo**, and **TypeScript**. It demonstrates modern mobile interface design, featuring smooth gesture-driven screen transitions, glassmorphic UI components, dynamic detail drawers, interactive watchlists, search filtering, and trailer playback.

---

## ✨ Features

- **Stunning UI/UX:** Curated, high-contrast dark color palette, clean typography, cards with image preloading, and active feedback states.
- **Fluid Gestures & Transitions:** Implements advanced transition models powered by `react-native-reanimated` and `react-native-screen-transitions`, including:
  - Contained scale-zooms for Movie Details and Gallery pages.
  - Interactive, swipe-to-dismiss bottom sheets for Watchlists and Share options.
  - Custom horizontal-inverted slide-drawers for Genre Filters.
- **Full-featured Search:** Instant search functionality filtering movies by text matching, featuring historical search query chips.
- **Queue/Watchlist Management:** Custom watchlist grouping ("Tonight", "Weekend Queue", "Flight Downloads") with interactive toggle status.
- **Multi-Platform Support:** Fully compiled and optimized to run on **iOS**, **Android**, and the **Web** as a Single Page Application (SPA).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Bun** (Recommended) or **npm**

### Installation

Install the package dependencies using **Bun**:

```bash
bun install
```

### Running the Application

Start the development server for your target platform:

#### 🌐 Web (SPA)
```bash
bun run web
```

#### 🤖 Android
```bash
bun run android
```

#### 🍏 iOS
```bash
bun run ios
```

#### 🔧 Expo Dev Server (with clearing cache)
```bash
bun start --clear
```

---

## 📂 Project Structure

```text
motion-flix/
├── assets/             # Media resources, icons, and adaptive splash screens
├── src/
│   ├── app/            # Expo Router file-based pages (index, movie, search, gallery, sheets)
│   ├── components/     # High-fidelity shared UI elements (movie-ui, animated-icons)
│   ├── constants/      # Theming constants and style tokens
│   ├── data/           # Mock data models for movies, cast members, and playlists
│   ├── navigation/     # Transition Stack configurations
│   ├── transitions/    # Reanimated custom gesture and style interpolator presets
│   └── types/          # Shared TypeScript type definitions
├── app.json            # Expo configuration (plugins, icons, single-page web settings)
├── tsconfig.json       # TypeScript configuration with directory path aliases
└── package.json        # Project scripts and dependencies
```

---

## 🛠️ Technology Stack

- **Framework:** [Expo (v56)](https://expo.dev) & [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **UI Engine:** [React Native](https://reactnative.dev) & [React Native Web](https://necolas.github.io/react-native-web/)
- **Animations:** [React Native Reanimated (v4)](https://docs.swmansion.com/react-native-reanimated/) (Worklets & spring mechanics)
- **Transitions & Gestures:** [react-native-screen-transitions](https://github.com/eds2002/react-native-screen-transitions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Package Manager:** [Bun](https://bun.sh)
