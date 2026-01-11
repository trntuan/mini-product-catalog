import 'react-native-reanimated';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './app/hooks/useTheme';
import RootNavigation from './app/routes/RootNavigation';
import ReduxProvider from './app/store';

// Configure Google Sign-In
// Use the web client ID from google-services.json (client_type: 3)
// 
// IMPORTANT: If you get DEVELOPER_ERROR, check:
// 1. SHA-1 fingerprint is added to Google Cloud Console OAuth client
//    Run: npm run get-sha1
// 2. Package name matches: com.miniproduct.catalog
// 3. Wait 5-10 minutes after updating Google Cloud Console
// 4. Rebuild app after configuration changes
GoogleSignin.configure({
  webClientId: '837456001453-bvn9jitd8c7o9bktnn2hrp7hs9adrkpm.apps.googleusercontent.com',
  offlineAccess: true, // Get refresh token
  // Optional: Add scopes if needed
  // scopes: ['profile', 'email'],
});

let Root = function App() {
  useEffect(() => {
    // Firebase is automatically initialized when the app starts
    // No explicit initialization needed for React Native Firebase
  }, []);

  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <ThemeProvider >
      <RootNavigation />
        </ThemeProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
export default Root;
