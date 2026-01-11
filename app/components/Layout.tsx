import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

import { ThemeContextInterface } from '../hooks/useTheme';
import { LayoutPropsType } from '../types/components';

const Layout = ({children, style, ...rest}: LayoutPropsType) => {
  const {theme}: Partial<ThemeContextInterface> = useTheme();
  return (
    <SafeAreaView edges={[ 'left', 'right']} style={styles.container} {...rest}>
      <StatusBar
        animated
        backgroundColor={theme.cardBg}
        barStyle="dark-content"
      />
      <View
        testID="Layout.LayoutContainer"
        style={[styles.layout, {backgroundColor: theme?.layoutBg}, style]}>
        <View
          pointerEvents="none"
          style={[
            styles.backgroundAccent,
            {backgroundColor: theme.primarySoft},
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.backgroundAccentSecondary,
            {backgroundColor: theme.accentSoft},
          ]}
        />
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {flex: 1},
  layout: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  backgroundAccent: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.45,
  },
  backgroundAccentSecondary: {
    position: 'absolute',
    top: 120,
    right: -140,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.3,
  },
});
