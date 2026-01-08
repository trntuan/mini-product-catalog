/**
 * This is a Navigation file which is wired already with Bottom Tab Navigation.
 * If you don't like it, feel free to replace with your own setup.
 * Uncomment commented lines from return() of RootNavigation to wire Login flow
 */
import React, { useEffect } from 'react';
import { ColorValue, Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
// import {useSelector, useDispatch} from 'react-redux';

// Hook for theme change (Light/Dark Mode)
import { typeVariants } from '../theme/theme';
import { useTheme } from '../theme/useTheme';
// Get Value from Keyring (Encrypted token)
import { getSecureValue } from '../utils/keyChain';
// Redux slice for updating Access Token to store
import { updateToken } from '@/app/store/userSlice';


// Screens
import NetworkExample from '@/app/screens/NetworkExample';
import Settings from '@/app/screens/Settings';
import Tasks from '@/app/screens/Tasks';
import Login from '../screens/auth/Login';
import ProductDetail from '../screens/products/ProductDetail';
import Products from '../screens/products/Products';
import { RootState } from '../store/store';

// Icons for Bottom Tab Navigation
const homeIcon = ({ color }: { color: ColorValue | undefined }) => (
  <Ionicons name="home-sharp" size={24} color={color} />
);
const productsIcon = ({ color }: { color: ColorValue | undefined }) => (
  <Ionicons name="grid-sharp" size={24} color={color} />
);
const networkIcon = ({ color }: { color: ColorValue | undefined }) => (
  <Ionicons name="wifi-sharp" size={24} color={color} />
);
const settingsIcon = ({ color }: { color: ColorValue | undefined }) => (
  <Ionicons name="settings-sharp" size={24} color={color} />
);

// Root Navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Products Stack Navigator (nested)
function ProductsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.cardBg,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: typeVariants.titleLarge.fontFamily,
          fontSize: 18,
          color: theme.primary,
          fontWeight: 'bold',
        },
        headerTintColor: theme.primary,
      }}>
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

export default function RootNavigation() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  // Copy existing token from local storage to redux store
  useEffect(() => {
    async function checkIsLogined() {
      try {
        let temp = await getSecureValue('token');
        dispatch(updateToken({ token: temp }));
      } catch (e) {}
    }
    checkIsLogined();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {user.token ? (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: theme.cardBg,
              borderTopColor: theme?.layoutBg,
            },
            tabBarInactiveTintColor: theme.color,
            tabBarActiveTintColor: theme.primary,
            headerStyle: {
              backgroundColor: theme.cardBg,
              height: Platform.OS == 'ios' ? 120 : 50,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: typeVariants.titleLarge.fontFamily,
              fontSize: 18,
              color: theme.primary,
              fontWeight: 'bold',
            },
            tabBarShowLabel: true,
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
            name="To Do"
            component={Tasks}
            options={{
              tabBarIcon: homeIcon,
              // tabBarTestID: 'BottomTab.ToDo',
            }}
          />
          <Tab.Screen
            name="NetworkExample"
            component={NetworkExample}
            options={{
              tabBarIcon: networkIcon,
              // tabBarTestID: 'BottomTab.Network',
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
