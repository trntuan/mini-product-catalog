import 'react-native-reanimated';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './routes/RootNavigation';
import ReduxProvider from './store';
import { ThemeProvider } from './theme/useTheme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <ThemeProvider>
          <RootNavigation />
          {/* <NoInternetToast /> */}
        </ThemeProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
