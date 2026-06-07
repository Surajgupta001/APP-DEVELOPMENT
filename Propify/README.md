# 🏠 Propify — Universal Real Estate Mobile App

Propify is a state-of-the-art, universal real estate mobile application designed to simplify buying, selling, and renting properties. Designed with premium visual aesthetics, a robust dark/light theme engine, and a fluid user experience, the application offers real-time listings, advanced search filters, interactive maps, and listing creation capabilities.

---

## 🌟 Key Features (About Propify)

- **🌙 Adaptive Theme Engine**: Real-time Light & Dark mode toggle. Persists preferences natively using `expo-secure-store` and adapts layouts dynamically using NativeWind class styling.
- **🔐 Clerk Onboarding & Authentication**: Secure, enterprise-grade authentication including verification flows (e.g., OTP validation) and local credential caching.
- **⚡ Real-time Supabase Database**: Instant listing updates and search querying. Uses the Supabase JS client to pull, filter, and load detailed property listings.
- **📷 Advanced Listing Creator**: Users can list new properties directly from their device. Includes camera/gallery access via `expo-image-picker` with an optimized base64-to-ArrayBuffer pipeline for seamless Supabase storage binary upload.
- **🗺️ Interactive Map & Location Views**: Filter, search, and localize properties by coordinate bounds, addresses, and cities.
- **✨ High-Fidelity UI/UX Design**: Curated color palettes, glassmorphism filters, smooth micro-animations, and styled empty states designed to capture attention.

---

## 🛠️ Technology Stack

- **Core & Runtime**: React Native, [Expo SDK 52](https://expo.dev)
- **Navigation**: Expo Router (File-based routing, tab-bar navigation)
- **Styling**: [NativeWind (Tailwind CSS v4)](https://nativewind.dev)
- **Authentication**: [@clerk/expo](https://clerk.com/docs/references/expo/overview)
- **Database & Storage**: [Supabase JS client](https://supabase.com)
- **Local Cache**: `expo-secure-store`
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: `@expo/vector-icons` (Ionicons)

---

## 📁 Directory Structure

```text
Propify/
├── assets/                  # Brand assets, icons, and logo SVGs
│   └── images/              # Logo files (propify.svg), badges, and placeholders
├── hooks/                   # Custom React Hooks
├── lib/                     # Global service connections
│   ├── supabase.ts          # Supabase client instantiation
│   └── utils.ts             # Base64-to-ArrayBuffer & visual helper functions
├── store/                   # Zustand global state stores
│   ├── filterStore.ts       # Query and category filtering criteria
│   └── userStore.ts         # Authentication context and states
├── src/
│   ├── app/                 # Expo Router routes (file-based navigation)
│   │   ├── (auth)/          # Authentication paths (sign-in, sign-up, verification)
│   │   ├── (root)/          # Authenticated routes
│   │   │   ├── (tabs)/      # Bottom tab routes (Home, Search, Saved, Create, Profile)
│   │   │   └── property/    # Property details ([id].tsx) and maps (map.tsx)
│   │   └── _layout.tsx      # Root providers wrapper (Clerk and ThemeInitializer)
│   └── components/          # Reusable component library
│       ├── Counter.tsx      # Bed/Bath numerical increment inputs
│       ├── FilterModal.tsx  # Interactive search, bounds, and tag filters
│       ├── MenuItem.tsx     # Clean setting items with dark mode adaptations
│       ├── PropertyCard.tsx # Property summary card
│       └── Toggle.tsx       # Switch selector component
├── types/                   # TypeScript schemas and models
│   └── index.ts             # Property interface and FormState schemas
├── app.json                 # Expo config plugin (Splash, bundle keys, scheme)
└── tailwind.config.js       # NativeWind config module
```

---

## 🚀 Installation & Setup Steps

Follow these instructions to set up the development environment and run the application locally.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org) (v18 or higher) or [Bun](https://bun.sh) (v1.0 or higher)
- [Expo Go](https://expo.dev/go) application on your mobile device (to run on physical hardware) OR Android Studio / Xcode (for emulators).

### ⚙️ Step-by-Step Installation

1. **Clone the Repository** and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd APP-DEVELOPMENT/Propify
   ```

2. **Install Project Dependencies**:
   Using Bun (Recommended):
   ```bash
   bun install
   ```
   Or using NPM:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the `Propify/` directory and configure the Clerk, Supabase, and admin credentials:
   ```env
   # CLERK
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

   # SUPABASE
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_...

   # ADMIN AND UTILITIES
   EXPO_PUBLIC_ADMIN_PHONE=917070031833
   ```

4. **Start the Expo Development Server**:
   Using Bun:
   ```bash
   bun start
   ```
   Or using NPM:
   ```bash
   npm run start
   ```

5. **Run the App**:
   - Press `a` to open on an Android Emulator.
   - Press `i` to open on an iOS Simulator.
   - Scan the QR code displayed in the terminal using the Expo Go app on a physical device.

---

## 🗄️ Database Schema & Storage Setup

Propify uses **Supabase** for its backend engine. The tables should match the following structure:

### 1. `properties` Table Schema
Ensure the `properties` table has the following schema layout:

| Field Name | Type | Key / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Unique identifier |
| `title` | `text` | Not Null | Title of the listing |
| `description`| `text` | Not Null | Detailed description |
| `price` | `numeric` | Not Null | Price of the property |
| `type` | `text` | Not Null | Category (e.g., apartment, house, villa, townhouse) |
| `bedrooms` | `integer` | Not Null, Default: `1` | Total bedrooms |
| `bathrooms` | `integer` | Not Null, Default: `1` | Total bathrooms |
| `area_sqft` | `numeric` | Not Null | Square footage |
| `address` | `text` | Not Null | Street address |
| `city` | `text` | Not Null | City location |
| `latitude` | `double precision` | Not Null | Coordinate Latitude |
| `longitude` | `double precision` | Not Null | Coordinate Longitude |
| `images` | `text[]` | Not Null | Array of Supabase public image URLs |
| `is_featured`| `boolean` | Default: `false` | Featured listing flag |
| `is_sold` | `boolean` | Default: `false` | Sold/Leased flag |
| `created_at` | `timestamp with time zone` | Default: `now()` | Timestamp |

### 2. Supabase Storage Setup
1. Create a public bucket in your Supabase dashboard named `property-images`.
2. Configure bucket access policies to allow authenticated users to perform `INSERT` and public reads (`SELECT`).

---

## 🔐 Clerk & Supabase Integration (JWT Templates)

To authorize authenticated users to upload files and edit listings in Supabase, set up a Custom JWT Template in Clerk:
1. Go to **Clerk Dashboard** -> **JWT Templates** -> **New Template** -> **Supabase**.
2. Customize the template (claims, naming) and copy the template key.
3. Configure Row Level Security (RLS) in Supabase using the Clerk-generated JWT token payloads for user-specific security policies.

---

## 🛠️ Advanced Development Notes

- **Secure Theme Caching**: To prevent native linker exceptions (e.g., `AsyncStorageError: Native module is null`), Propify uses `expo-secure-store` to cache the theme preference (`theme_preference: 'light' | 'dark'`). This ensures zero dependency on legacy packages.
- **Supabase Binary Upload Workaround**: Constructing `Blob` instances directly from `ArrayBuffer` in React Native environments can trigger compatibility crashes. Propify avoids this by leveraging a custom base64-to-ArrayBuffer parser helper inside [utils.ts](file:///c:/Programming/APP-DEVELOPMENT/Propify/lib/utils.ts) to format pick file data safely before transmission.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

### Happy Coding! 🚀🏠✨
