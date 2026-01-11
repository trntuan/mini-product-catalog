# Mini Product Catalog

A React Native mobile application built with Expo for browsing and managing a product catalog.

## 📋 Tech Stack & Versions

- **Expo SDK**: ~54.0.31
- **React Native**: 0.81.5
- **React**: 19.1.0
- **Node.js**: Required (see Prerequisites)
- **TypeScript**: ~5.9.2

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (optional, but recommended)
- For iOS development: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- For Android development: [Android Studio](https://developer.android.com/studio)

## 📦 Setup and Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mini-product-catalog
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment (Optional)

If you're using Google OAuth, configure your Google Client ID in `app.json`:

1. Open `app.json`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` in `extra.googleOAuthClientId` with your actual Google OAuth Client ID
3. See [Google OAuth Setup](#-google-oauth-setup) section for detailed instructions

### Step 4: Prebuild Native Code (First Time Only)

If you need native modules or are building for Android/iOS, run:

```bash
npx expo prebuild
```

## 🚀 Running the Application

### ⚠️ Important: Development Build Required

This app uses native modules (`@react-native-google-signin/google-signin` and `@react-native-firebase/auth`) that **do not work with Expo Go**. You need to create a **development build** (custom dev client).

### First Time Setup: Create Development Build

1. **Build the development client:**
   ```bash
   # For Android
   npx expo run:android
   
   # For iOS
   npx expo run:ios
   ```
   
   This will:
   - Prebuild native code
   - Install native dependencies
   - Build and install a custom development client on your device/emulator
   - Start the development server

2. **After the first build, you can use the dev client:**
   - The custom dev client app will be installed on your device
   - It looks similar to Expo Go but includes your native modules
   - You can scan QR codes or use the development server just like Expo Go

### Development Mode

Start the Expo development server:

```bash
npm start
# or
npx expo start --dev-client
```

This will:
- Open Expo DevTools in your browser
- Display a QR code for testing on physical devices
- Provide options to run on emulators/simulators

**Quick Actions:**
- Press `a` - Open on Android emulator
- Press `i` - Open on iOS simulator  
- Press `w` - Open in web browser
- Press `r` - Reload the app
- Press `m` - Toggle menu

### Running on Physical Devices

**Android:**
1. Enable Developer Options and USB Debugging on your Android device
2. Connect via USB or ensure device is on the same network
3. Scan the QR code with your **custom dev client** (not Expo Go), or run:
   ```bash
   npm run android
   ```

**iOS:**
1. Ensure your Mac has Xcode installed
2. Connect your iOS device or use the simulator
3. Scan the QR code with your **custom dev client** (not Expo Go), or run:
   ```bash
   npm run ios
   ```

### Start with Clean Cache

If you encounter caching issues or unexpected behavior:

```bash
npx expo start --clear
```

## 🔨 Building for Debug

### Android Debug Build

1. **Prebuild native code** (if needed):
   ```bash
   npx expo prebuild --clean
   ```

2. **Run on Android emulator or device**:
   ```bash
   npm run android
   # or
   npx expo run:android
   ```

   Or use the combined command:
   ```bash
   npm run rebuild:android
   ```

### iOS Debug Build

1. **Prebuild native code** (if needed):
   ```bash
   npx expo prebuild --clean --platform ios
   ```

2. **Run on iOS simulator or device**:
   ```bash
   npm run ios
   # or
   npx expo run:ios
   ```

   Or use the combined command:
   ```bash
   npm run rebuild:ios
   ```

### Web Development

Run the app in a web browser:

```bash
npm run web
# or
npx expo start --web
```

## 🔐 Google OAuth Setup

To enable Google Sign-In functionality:

1. **Create a Google OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one (current project: `dotoappdemo`)
   - Enable the Google Sign-In API (not Google+ API, which is deprecated)
   - Navigate to "APIs & Services" → "Credentials"
   - Create an OAuth 2.0 Client ID for Android with:
     - Package name: `com.miniproduct.catalog`
     - SHA-1 certificate fingerprint (see below)
   - Create a Web application OAuth client ID (for the `webClientId` in code)

2. **Get SHA-1 Certificate Fingerprint:**
   
   Run the provided script to get your SHA-1 fingerprint:
   ```bash
   npm run get-sha1
   ```
   
   Or manually:
   ```bash
   # For debug keystore (development)
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # For release keystore (production)
   keytool -list -v -keystore <path-to-your-release-keystore> -alias <your-alias>
   ```
   
   Copy the SHA-1 value (format: `XX:XX:XX:...`) and add it to your Android OAuth client in Google Cloud Console.

3. **Configure the Client ID:**
   - The `webClientId` is already configured in `App.tsx`
   - Make sure the SHA-1 fingerprint matches what's in Google Cloud Console
   - The package name must match: `com.miniproduct.catalog`

4. **Rebuild the app after configuration changes:**
   ```bash
   npm run rebuild:android
   ```

## 📝 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run prebuild:clean` - Clean prebuild native code
- `npm run rebuild:android` - Clean prebuild and run on Android
- `npm run rebuild:ios` - Clean prebuild and run on iOS
- `npm run reset-project` - Reset project to blank state

## 🧹 Troubleshooting

### Expo Go Not Supported

**Error:** `TurboModuleRegistry.getEnforcing(...): 'RNGoogleSignin' could not be found`

**Solution:** This app requires a **development build**, not Expo Go. Native modules like `@react-native-google-signin/google-signin` don't work in Expo Go.

1. **Create a development build:**
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

2. **Use the custom dev client** instead of Expo Go:
   - The dev client will be installed on your device after the first build
   - It includes all your native modules
   - You can still use QR codes and hot reloading

3. **Start the dev server:**
   ```bash
   npx expo start --dev-client
   ```

### Google Sign-In DEVELOPER_ERROR

If you encounter `DEVELOPER_ERROR` when trying to sign in with Google:

1. **Verify SHA-1 Fingerprint:**
   ```bash
   npm run get-sha1
   ```
   This will show your current SHA-1 fingerprint. Make sure it matches what's configured in Google Cloud Console.

2. **Add SHA-1 to Google Cloud Console OAuth Client:**
   
   ⚠️ **IMPORTANT**: Firebase Console and Google Cloud Console are different!
   - You need to add SHA-1 in **BOTH places**:
     1. ✅ Firebase Console (Project Settings → Your Android App) - You've done this!
     2. ❌ Google Cloud Console (APIs & Services → Credentials → OAuth 2.0 Client ID) - **This is required!**
   
   Steps:
   - Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials?project=dotoappdemo)
   - Find your **OAuth 2.0 Client ID** (Android type)
   - Client ID should be: `837456001453-81dq0gt2pv3gusskkm8d6k5q1d55sj4l.apps.googleusercontent.com`
   - Click **Edit** (pencil icon)
   - Under **SHA certificate fingerprints**, click **+ ADD SHA CERTIFICATE FINGERPRINT**
   - Add: `32:75:70:61:E6:1A:36:3C:E7:19:DD:5B:CB:F9:8C:2C:98:AA:31:43`
   - **Save** and wait 5-10 minutes for changes to propagate
   
   See `scripts/verify-oauth-setup.md` for detailed instructions.

3. **Verify Package Name:**
   - Ensure package name in `app.json` matches: `com.miniproduct.catalog`
   - Verify it matches in Google Cloud Console OAuth client

4. **Verify Web Client ID:**
   - Check `App.tsx` - the `webClientId` should match the Web application OAuth client ID
   - Current: `837456001453-bvn9jitd8c7o9bktnn2hrp7hs9adrkpm.apps.googleusercontent.com`

5. **Clean and Rebuild:**
   ```bash
   # Clean build
   npm run rebuild:android
   
   # Or manually:
   npx expo prebuild --clean
   npm run android
   ```

6. **Check google-services.json:**
   - Ensure `google-services.json` is in the project root
   - Verify it contains the correct package name and OAuth client configuration
   - After changes, rebuild the app

7. **Common Issues:**
   - **SHA-1 mismatch**: Most common cause - ensure SHA-1 in Google Cloud Console matches your keystore
   - **Wrong package name**: Package name must exactly match in app.json and Google Cloud Console
   - **Missing OAuth client**: Ensure both Android and Web OAuth clients are created
   - **Configuration not propagated**: Wait 5-10 minutes after updating Google Cloud Console
   - **Wrong keystore**: Using release keystore SHA-1 for debug builds (or vice versa)

### Clear All Dependencies and Cache

If you encounter persistent issues, try clearing everything:

```bash
# Remove node_modules and lock files
rm -rf node_modules yarn.lock package-lock.json

# Reinstall dependencies
npm install

# Start with clean cache
npx expo start --clear
```

### Reset Project

To reset the project to a blank state:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory.

## 📚 Project Structure

```
mini-product-catalog/
├── app/                    # Main application code
│   ├── api/               # API client and services
│   ├── components/        # Reusable components
│   ├── routes/            # Navigation configuration
│   ├── screens/           # Screen components
│   ├── services/          # Business logic services
│   ├── store/             # Redux store and slices
│   ├── theme/             # Theme configuration
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                 # Images and static assets
├── components/             # Shared components
└── constants/              # App constants
```

## 📖 Learn More

- [Expo Documentation](https://docs.expo.dev/) - Learn fundamentals and advanced topics
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/) - Step-by-step tutorial
- [React Native Documentation](https://reactnative.dev/) - React Native guides
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/) - File-based routing

## 🤝 Community

- [Expo on GitHub](https://github.com/expo/expo) - View the open source platform
- [Discord Community](https://chat.expo.dev) - Chat with Expo users and ask questions

## 🔮 What I Would Improve With More Time

This section outlines potential enhancements and improvements that could be made to the application given additional development time:

### 🧪 Testing & Quality Assurance
- **Unit Tests**: Add comprehensive unit tests for services, reducers, and utility functions using Jest and React Native Testing Library
- **Integration Tests**: Test API integration, Redux store interactions, and navigation flows
- **E2E Tests**: Implement end-to-end testing with Detox or Maestro for critical user flows
- **Test Coverage**: Aim for 80%+ code coverage, especially for business logic and state management

### 🎨 User Experience Enhancements
- **Dark Mode**: Implement full dark mode support with theme switching (currently has theme infrastructure)
- **Accessibility**: Add comprehensive accessibility features (screen reader support, proper labels, keyboard navigation)
- **Loading States**: Improve loading indicators and skeleton screens for better perceived performance
- **Error Handling**: Enhance error messages with user-friendly feedback and retry mechanisms
- **Empty States**: Create engaging empty states for favorites, search results, and product lists

### ⚡ Performance Optimizations
- **Image Optimization**: Implement image caching, lazy loading, and progressive image loading
- **Code Splitting**: Add dynamic imports and route-based code splitting to reduce initial bundle size
- **Memoization**: Optimize re-renders with React.memo, useMemo, and useCallback where appropriate
- **Virtualization**: Optimize FlatList performance for large product lists with better virtualization
- **Bundle Size**: Analyze and reduce bundle size using tools like react-native-bundle-visualizer

### 🔒 Security & Reliability
- **Token Refresh**: Implement automatic token refresh mechanism to handle expired tokens gracefully
- **Biometric Authentication**: Add fingerprint/Face ID authentication for enhanced security
- **Certificate Pinning**: Implement SSL certificate pinning for API requests
- **Input Validation**: Strengthen client-side validation and sanitization
- **Error Tracking**: Integrate crash reporting and error tracking (Sentry, Bugsnag)

### 📱 Features & Functionality
- **Push Notifications**: Add push notifications for product updates, favorites, and promotions
- **Offline Sync**: Improve offline functionality with background sync when connection is restored
- **Search Improvements**: Add search history, recent searches, and search suggestions
- **Product Comparison**: Allow users to compare multiple products side-by-side
- **Sharing**: Enable sharing of products via social media or messaging apps
- **Reviews & Ratings**: Add product reviews and rating system
- **Wishlist Management**: Enhance favorites with categories, notes, and sharing capabilities

### 🌍 Internationalization
- **i18n Support**: Implement full internationalization (i18n) for multiple languages
- **RTL Support**: Add right-to-left language support for Arabic, Hebrew, etc.
- **Localization**: Localize dates, numbers, and currency formats

### 🏗️ Architecture & Code Quality
- **Type Safety**: Improve TypeScript coverage and add stricter type checking
- **Code Documentation**: Add JSDoc comments and comprehensive inline documentation
- **API Documentation**: Document API endpoints and data structures
- **Design System**: Create a comprehensive design system with Storybook
- **State Management**: Consider optimizing Redux store structure and reducing boilerplate

### 🚀 DevOps & CI/CD
- **CI/CD Pipeline**: Set up automated testing, linting, and building with GitHub Actions or similar
- **Automated Releases**: Implement automated versioning and release management
- **Beta Testing**: Set up TestFlight (iOS) and Google Play Internal Testing (Android)
- **Analytics**: Integrate analytics (Firebase Analytics, Mixpanel) for user behavior tracking
- **Performance Monitoring**: Add performance monitoring and APM tools

### 📊 Data & Analytics
- **User Analytics**: Track user behavior, popular products, and feature usage
- **Performance Metrics**: Monitor app performance, load times, and crash rates
- **A/B Testing**: Implement A/B testing framework for feature experimentation
- **Caching Strategy**: Optimize caching strategy for better offline experience and reduced API calls

### 🎯 Product Enhancements
- **Advanced Filtering**: Add more filter options (price range, brand, rating, availability)
- **Sorting Options**: Enhance sorting with more options (newest, price low-high, popularity)
- **Product Recommendations**: Implement recommendation engine based on user behavior
- **Recently Viewed**: Add recently viewed products feature
- **Cart Functionality**: If applicable, add shopping cart and checkout flow

### 📚 Documentation
- **API Documentation**: Create comprehensive API documentation
- **Component Library**: Document all reusable components with examples
- **Architecture Guide**: Expand ARCHITECTURE.md with more detailed explanations
- **Contributing Guide**: Add CONTRIBUTING.md with development guidelines
- **Deployment Guide**: Create detailed deployment instructions for production

### 🔧 Developer Experience
- **Pre-commit Hooks**: Add Husky with lint-staged for code quality checks
- **VS Code Extensions**: Document recommended VS Code extensions and settings
- **Debugging Tools**: Set up React Native Debugger and Flipper integration
- **Environment Variables**: Implement proper environment variable management for different environments

---

*Note: This list represents potential improvements and is not exhaustive. Prioritization should be based on user needs, business requirements, and technical debt.*

## 📄 License

This project is private.
