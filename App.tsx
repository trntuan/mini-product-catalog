import 'react-native-reanimated';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './app/hooks/useTheme';
import RootNavigation from './app/routes/RootNavigation';
import ReduxProvider from './app/store';

const googleWebClientId =
  (Constants.expoConfig?.extra?.googleWebClientId as string | undefined) ?? '';

GoogleSignin.configure({
  webClientId: googleWebClientId,
  offlineAccess: true, // Get refresh token
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
