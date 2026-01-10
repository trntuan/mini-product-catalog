/**
 * This is a Navigation file which is wired already with Bottom Tab Navigation.
 * If you don't like it, feel free to replace with your own setup.
 * Uncomment commented lines from return() of RootNavigation to wire Login flow
 */
import React, { useEffect } from 'react';
import { ColorValue, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
// import {useSelector, useDispatch} from 'react-redux';

// Hook for theme change (Light/Dark Mode)
import { themeType, typeVariants } from '../theme/theme';
import { useTheme } from '../theme/useTheme';
// Get Value from Keyring (Encrypted token)
import { getSecureValue } from '../utils/keyChain';
// Redux slice for updating Access Token to store
import { updateToken } from '@/app/store/userSlice';
import { KEYCHAIN_KEYS } from '../types/constants';


// Screens
import Settings from '@/app/screens/setings/Settings';
import Login from '../screens/auth/Login';
import Favorites from '../screens/products/Favorites';
import ProductDetail from '../screens/products/ProductDetail';
import Products from '../screens/products/Products';
import { RootState } from '../store/store';

// Icons for Bottom Tab Navigation

const productsIcon = ({ color, focused }: { color: ColorValue | undefined; focused: boolean }) => (
  <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
);

const favoritesIcon = ({ color, focused }: { color: ColorValue | undefined; focused: boolean }) => (
  <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
);

const settingsIcon = ({ color, focused }: { color: ColorValue | undefined; focused: boolean }) => (
  <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
);

// Root Navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Route names constants
const ROUTE_NAMES = {
  PRODUCT_DETAIL: 'ProductDetail',
} as const;

// Helper function to get common stack navigator screen options
const getStackScreenOptions = (theme: themeType) => ({
  headerStyle: {
    backgroundColor: theme.cardBg,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.cardBorderColor,
  },
  headerTitleAlign: 'left' as const,
  headerTitleStyle: {
    fontFamily: typeVariants.titleLarge.fontFamily,
    fontSize: 20,
    color: theme.color,
    fontWeight: '600' as const,
  },
  headerTintColor: theme.color,
});

// Helper function to check if tab bar should be hidden
const shouldHideTabBar = (routeName: string | undefined): boolean => {
  return routeName === ROUTE_NAMES.PRODUCT_DETAIL;
};

// Products Stack Navigator (nested)
function ProductsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="ProductsList"
        component={Products}
        options={{
          title: 'Products',
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{
          title: 'Product Details',
        }}
      />
    </Stack.Navigator>
  );
}

// Favorites Stack Navigator (nested)
function FavoritesStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen
        name="FavoritesList"
        component={Favorites}
        options={{
          title: 'Favorites',
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{
          title: 'Product Details',
        }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();

  // Copy existing token from local storage to redux store
  useEffect(() => {
    async function checkIsLogined() {
      try {
        let temp = await getSecureValue(KEYCHAIN_KEYS.TOKEN);
        dispatch(updateToken({ token: temp }));
      } catch (e) {}
    }
    checkIsLogined();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {user.token ? (
        <Tab.Navigator
          screenOptions={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            const hideTabBar = shouldHideTabBar(routeName);
            
            return {
              tabBarStyle: {
                backgroundColor: theme.cardBg,
                borderTopColor: theme?.layoutBg,
                display: hideTabBar ? 'none' : 'flex',
              },
              tabBarInactiveTintColor: theme.color + '80',
              tabBarActiveTintColor: theme.primary,
              headerStyle: {
                backgroundColor: theme.cardBg,
                height: Platform.OS === 'ios' ? 120 : 50,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.cardBorderColor,
              },
              headerTitleAlign: 'left',
              headerTitleStyle: {
                fontFamily: typeVariants.titleLarge.fontFamily,
                fontSize: 18,
                color: theme.color,
                fontWeight: 'bold',
              },
              tabBarShowLabel: true,
            };
          }}
        >
          <Tab.Screen
            name="Home"
            component={ProductsStack}
            options={{
              headerShown: false,
              tabBarIcon: productsIcon,
              // tabBarTestID: 'BottomTab.Products',
            }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesStack}
            options={{
              headerShown: false,
              tabBarIcon: favoritesIcon,
              // tabBarTestID: 'BottomTab.Favorites',
            }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              // headerShown: false,
              tabBarIcon: settingsIcon,
              // tabBarTestID: 'BottomTab.Settings',
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
