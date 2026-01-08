import 'react-native-reanimated';


import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './app/routes/RootNavigation';
import ReduxProvider from './app/store';
import { ThemeProvider } from './app/theme/useTheme';

let Root = function App() {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <ThemeProvider >
      <RootNavigation />
          {/* <NoInternetToast /> */}
        </ThemeProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
export default Root;
