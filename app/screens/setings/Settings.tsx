import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services';
import { RootState } from '../../store/store';
import { clearUser, updateUser } from '../../store/userSlice';
import { KEYCHAIN_KEYS } from '../../types/constants';
import { getSecureValue, removeSecureValue } from '../../utils/keyChain';

import Card from '../../components/Card';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '../../types/content';

const avatar = require('@/assets/images/avatar.png');

const Settings = () => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Load user data if missing but token exists
  useEffect(() => {
    const loadUserData = async () => {
      // If user data is already present, skip
      if (user.name || user.username) {
        return;
      }

      try {
        setIsLoadingUser(true);
        const token = await getSecureValue(KEYCHAIN_KEYS.TOKEN);
        
        if (token) {
          // Try to get user info from API
          try {
            const userInfo = await authService.getCurrentUser();
            
            if (userInfo) {
              const { firstName, lastName, username, email } = userInfo;
              const name = [firstName, lastName].filter(Boolean).join(' ') || username || email || '';
              
              dispatch(updateUser({
                name,
                username: username || email || '',
                token: token,
              }));
            }
          } catch (error) {
            // API might not support /auth/me endpoint, or token is invalid
            // In that case, user will need to login again
            console.log('Could not fetch user data:', error);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();
  }, [dispatch, user.name, user.username]);

  const handleLogout = () => {
    // Remove both access token and refresh token from Local
    removeSecureValue(KEYCHAIN_KEYS.TOKEN);
    removeSecureValue(KEYCHAIN_KEYS.REFRESH_TOKEN);
    // Remove access token from redux store
    dispatch(clearUser());
  };

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={{backgroundColor: theme.layoutBg}}>
        <Card style={[styles.card, {backgroundColor: theme.cardBg, borderColor: theme.cardBorderColor}]}>
          <View style={styles.avatarRow}>
            <Image
              source={avatar}
              style={[styles.avatar, {borderColor: theme.cardBorderColor}]}
            />
            <View style={styles.userInfo}>
              <Text variant="titleLarge" style={{color: theme.color, marginBottom: 4}}>
                {user.name || CONTENT_KEYS.LABELS.USER}
              </Text>
              <Text variant="bodyMedium" style={{color: theme.color, opacity: 0.7}}>
                {user.username ? `@${user.username}` : CONTENT_KEYS.LABELS.NO_USERNAME}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, {backgroundColor: theme.cardBorderColor}]} />
          <View style={styles.menuSection}>
            <Pressable
              onPress={handleLogout}
              style={({pressed}) => [
                styles.logoutButton,
                {
                  backgroundColor: pressed ? `${theme.error}1A` : `${theme.error}12`,
                },
              ]}>
              <Ionicons name="log-out-outline" size={18} color={theme.error} />
              <Text style={[styles.logoutText, {color: theme.error}]}>
                {CONTENT_KEYS.BUTTONS.LOGOUT}
              </Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </Layout>
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 70,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 50,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  menuSection: {
    paddingTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  logoutText: {
    fontWeight: '600',
  },
});
