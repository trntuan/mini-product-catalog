<div align="center">
  <img src="assets/images/splashscreen_logo.png" alt="Mini Product Catalog" width="600" style="border-radius: 12px;" />
</div>

<div>
  <h1>🛍️ Mini Product Catalog App</h1>
  <p>A React Native (Expo) app for browsing and managing a product catalog with offline-first caching.</p>

  <p>
    <a href="https://reactnative.dev/" target="_blank">
      <img src="https://img.shields.io/badge/React_Native-v0.81.5-blue?style=for-the-badge&logo=react&logoColor=white" alt="react-native" />
    </a>
    <a href="https://expo.dev/" target="_blank">
      <img src="https://img.shields.io/badge/Expo_SDK-v54.0.31-black?style=for-the-badge&logo=expo&logoColor=white" alt="expo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="https://img.shields.io/badge/TypeScript-v5.9.2-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    </a>
  </p>

  <h3>Core Libraries</h3>
  <p>
    <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="redux-toolkit" />
    <img src="https://img.shields.io/badge/Async_Storage-3B82F6?style=for-the-badge" alt="async-storage" />
    <img src="https://img.shields.io/badge/Google_Sign--In-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="google-sign-in" />
    <img src="https://img.shields.io/badge/REST_API-DummyJSON-111111?style=for-the-badge" alt="dummyjson" />
  </p>

  <h3>Platforms</h3>
  <p>
    <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="ios" />
    <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="android" />
  </p>
</div>

---

## Why This Architecture

This project was designed to look and behave like a **production feature**, not a demo:

* Redux Toolkit for predictable state management
* API + caching + retry logic
* Offline fallback
* Pagination instead of loading everything
* Debounced search for UX & performance
* Local persistence for favorites

## Features


### Authentication

* Google Sign-In
* Session-based login
* Logout

### Product List (Home)

* API pagination 
* Smooth infinite scroll
* Pull-to-refresh
* Loading, empty, and error states
* Rating (stars), price, and thumbnail

### Product Detail

* Fetch by product ID
* Image carousel
* Description, stock, brand, category
* Loading & error handling

### Search, Filter & Sort

* Debounced search (300–500ms)
* Category filter
* Local sorting:

  * Price (low → high)
  * Price (high → low)
  * Rating (high → low)

### Favorites

* Favorite / unfavorite products
* Persisted locally (AsyncStorage)
* Dedicated Favorites screen

### Offline-first Caching

* Cached product list shown on app launch
* Background refresh
* If API fails → cached data still shown with offline banner

## Quick Start

### Install dependencies

```bash
npm install
```

### Build the dev client

```bash
npx expo run:android
# or
npx expo run:ios
```

### Start the dev server

```bash
npx expo start --dev-client
```

## API Endpoints Used

- Products: `https://dummyjson.com/products?limit=10&skip=0`
- Product detail: `https://dummyjson.com/products/{id}`
- Search: `https://dummyjson.com/products/search?q=phone`
- Categories: `https://dummyjson.com/products/categories`

## Project Structure

```
.
├── App.tsx # Entry app component
├── app/ # Application source
│   ├── api/ # API clients, config, endpoints
│   ├── components/ # Reusable UI components
│   │   ├── feedback/ # Empty, loading, error states
│   │   ├── navigation/ # Navigation-related UI
│   │   ├── products/ # Product UI pieces
│   │   └── ui/ # Base UI primitives
│   ├── hooks/ # Custom React hooks
│   ├── routes/ # Navigation stacks and route config
│   ├── screens/ # App screens
│   │   ├── auth/ # Auth flow screens
│   │   ├── products/ # Product browsing screens
│   │   └── setings/ # Settings screens
│   ├── services/ # Business logic and domain services
│   ├── store/ # Redux store setup
│   ├── theme/ # Theme tokens and styles
│   ├── types/ # TypeScript types
│   └── utils/ # Shared helpers and utilities
├── assets/ # Static assets
│   └── images/ # App images
├── constants/ # Global constants

```

## What I Would Improve With More Time

- Add unit, integration, and E2E tests with coverage reporting
- Implement app performance monitoring and crash analytics
- Optimize images (prefetching, caching, and memory usage)
- Expand accessibility (screen reader labels, contrast, dynamic type)
- Harden release pipeline (CI/CD, code signing, automated builds)
- Internationalization support and content localization
- Introduce feature flags and remote config for safer rollouts
- Add offline mutation queue with conflict resolution
- Improve security hardening (secure storage, jailbreak/root checks)
