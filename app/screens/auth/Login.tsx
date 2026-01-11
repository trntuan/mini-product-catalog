import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

import CustomLoad from '../../components/feedback/CustomLoad';
import { Button } from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card';
import { Input } from '../../components/ui/Form';
import Layout from '../../components/ui/Layout';
import Text from '../../components/ui/Text';
import { useAuth } from '../../hooks';
import { useTheme } from '../../hooks/useTheme';
import type { ValuesType } from '../../types/auth';
import { CONTENT_KEYS } from '../../types/content';

const AppIcon = require('@/assets/images/appicon.png');

const initialValues: ValuesType = {username: '', password: ''};

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, CONTENT_KEYS.AUTH.VALIDATION.USERNAME_MIN_LENGTH)
    .required(CONTENT_KEYS.AUTH.VALIDATION.REQUIRED),
  password: Yup.string().min(5, CONTENT_KEYS.AUTH.VALIDATION.TOO_SHORT).required(CONTENT_KEYS.AUTH.VALIDATION.REQUIRED),
});

const Login = () => {
  const {theme} = useTheme();
  const {isLoading, handleLogin, handleGoogleLogin} = useAuth();

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.container}>
          <Card style={styles.formWrapper}>
            <Formik
              initialValues={initialValues}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                return (
                  <>
                    <View style={styles.iconWrapper}>
                      <Image source={AppIcon} style={styles.appIcon} />
                    </View>
                    <Text variant="titleLarge" style={[styles.welcomeText, {color: theme.color}]}>
                      {CONTENT_KEYS.AUTH.TITLES.WELCOME_BACK}
                    </Text>
                    <Text variant="bodyMedium" style={[styles.subtitleText, {color: theme.color}]}>
                      {CONTENT_KEYS.AUTH.MESSAGES.SIGN_IN_TO_CONTINUE}
                    </Text>
                    <View style={styles.inputContainer}>
                      <Input
                        testID="Login.Username"
                        placeholder={CONTENT_KEYS.AUTH.PLACEHOLDERS.USERNAME_OR_EMAIL}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={
                          errors.username && touched.username ? errors.username : ''
                        }
                      />
                      <Input
                        testID="Login.Password"
                        placeholder={CONTENT_KEYS.AUTH.PLACEHOLDERS.PASSWORD}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                        error={
                          errors.password && touched.password ? errors.password : ''
                        }
                      />
                    </View>
                    <Button
                      onPress={() => handleSubmit()}
                      text={CONTENT_KEYS.BUTTONS.SIGN_IN}
                      style={styles.signInButton}
                    />
                    <View style={styles.dividerContainer}>
                      <View style={[styles.divider, {backgroundColor: theme.color + '30'}]} />
                      <Text variant="bodySmall" style={[styles.dividerText, {color: theme.color}]}>
                        {CONTENT_KEYS.LABELS.OR}
                      </Text>
                      <View style={[styles.divider, {backgroundColor: theme.color + '30'}]} />
                    </View>
                    <TouchableOpacity
                      style={[styles.googleButton, {borderColor: theme.color + '40'}]}
                      onPress={() => {
                        handleGoogleLogin().catch((e) => {
                          console.error('Google login error:', e);
                        });
                      }}
                      testID="Login.GoogleButton"
                      disabled={isLoading}>
                      <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.googleIcon} />
                      <Text style={[styles.googleButtonText, {color: theme.color}]}>
                        {CONTENT_KEYS.BUTTONS.CONTINUE_WITH_GOOGLE}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }}
            </Formik>
          </Card>
        </View>
      </ScrollView>
      <CustomLoad isLoading={isLoading} />
    </Layout>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitleText: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 24,
  },
  signInButton: {
    marginBottom: 6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.6,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
