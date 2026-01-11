# Mini Product Catalog App

A React Native mobile application built with Expo for browsing and managing a product catalog.

## Versions

- **Expo SDK**: 54.0.31
- **React Native**: 0.81.5
- **TypeScript**: 5.9.2

---

## Tech Stack

* React Native (Expo)
* TypeScript
* Redux Toolkit
* AsyncStorage
* Google Sign-In
* REST API (DummyJSON)

---

## Why This Architecture

This project was designed to look and behave like a **production feature**, not a demo:

* Redux Toolkit for predictable state management
* API + caching + retry logic
* Offline fallback
* Pagination instead of loading everything
* Debounced search for UX & performance
* Local persistence for favorites

---

## How To Run

> This app uses native modules, so **Expo Go will not work**.
> You must use a **development build**.

### 1. Install dependencies

```bash
npm install
```

### 2. Build the dev client

```bash
npx expo run:android
# or
npx expo run:ios
```

### 3. Start the dev server

```bash
npx expo start --dev-client
```

---

## What This App Demonstrates

This app implements a complete real-world flow:

* Google login
* Product browsing
* Search, filter, and sort
* Infinite scroll
* Product detail
* Favorites with persistence
* Offline-first caching

All features are built against a live API:
[https://dummyjson.com/products](https://dummyjson.com/products)

---

## Core Features

### Authentication

* Google Sign-In
* Session-based login
* Logout

### Product List (Home)

* API pagination (`limit / skip`)
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

---

## API Endpoints Used

* Products
  `https://dummyjson.com/products?limit=10&skip=0`

* Product detail
  `https://dummyjson.com/products/{id}`

* Search
  `https://dummyjson.com/products/search?q=phone`

* Categories
  `https://dummyjson.com/products/categories`

---

## What I Would Improve With More Time

* Automated tests (unit + integration)
* Better image caching & prefetching
* Dark mode + accessibility
* More advanced filters
* CI/CD and release pipelines
* Crash & performance monitoring

---

