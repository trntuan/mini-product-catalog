import React from 'react';
import { Image, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { clearUser } from '../../store/userSlice';
import { KEYCHAIN_KEYS } from '../../types/constants';
import { removeSecureValue } from '../../utils/keyChain';

import Card from '../../components/Card';
import Layout from '../../components/Layout';
import MenuItem from '../../components/MenuItem';
import Text from '../../components/Text';
import { useTheme } from '../../theme/useTheme';

const avatar = require('@/assets/images/avatar.png');

const Settings = () => {
  const {theme, toggleTheme} = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

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
        style={[styles.contentContainer, {backgroundColor: theme.layoutBg}]}>
        <Card style={[styles.card, {backgroundColor: theme.cardBg}]}>
          <View style={styles.avatarRow}>
            <Image source={avatar} style={styles.avatar} />
            <View>
              <Text style={{color: theme.color}}>
                {user.name || 'User'}
              </Text>
              <Text variant="titleSmall" style={{color: theme.color}}>
                {user.username ? `@${user.username}` : 'No username'}
              </Text>
            </View>
          </View>
          <>
  
            <MenuItem
              label="Dark Mode"
              onPress={() => {}}
              rightItem={
                <Switch
                  testID="Settings.ThemeSwitch"
                  value={theme.name === 'dark'}
                  onValueChange={value => toggleTheme(value)}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={theme.name === 'dark' ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              }
            />
            <MenuItem label="Logout" onPress={handleLogout} />
          </>
        </Card>
      </ScrollView>
    </Layout>
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingTop: 30,
    paddingBottom: 70,
    paddingHorizontal: 12,
  },
  card: {
    marginBottom: 50,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    marginRight: 10,
  },
});
