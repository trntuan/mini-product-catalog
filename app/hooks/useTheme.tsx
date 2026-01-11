/**
 * Theme
 */

import React from 'react';

// Import theme from theme file
import { theme, ThemeType } from '../theme/foundation';

// Types
export interface ThemeContextInterface {
  theme: ThemeType;
}

interface ThemeProviderInterface {
  children: React.ReactNode;
}

// Context
const ThemeContext = React.createContext({} as ThemeContextInterface);

// Provider to be used in index/App/or top of any parent
export const ThemeProvider = ({
  children,
}: ThemeProviderInterface): React.JSX.Element => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme hook for easy access to theme
export const useTheme = () => {
  const state = React.useContext(ThemeContext);
  return { theme: state.theme };
};
