import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import { useDispatch } from 'react-redux';
import Card from '../../components/Card';
import CustomLoad from '../../components/CustomLoad';
import { Input } from '../../components/Form';
import Layout from '../../components/Layout';
import { authService } from '../../services';
import { ApiException } from '../../api';
import { updateUser } from '../../store/userSlice';
import { transformToFormikErrors } from '../../utils/form';
import { setSecureValue } from '../../utils/keyChain';
import { KEYCHAIN_KEYS } from '../../types/constants';
const AppIcon = require('@/assets/images/appicon.png');

interface ValuesType {
  username: string;
  password: string;
}

const initialValues: ValuesType = {username: '', password: ''};

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Username must contain atleast 5 characters')
    .required('Required'),
  password: Yup.string().min(5, 'Too Short!').required('Required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: ValuesType, {setErrors}: any) => {
    // Create request body object
    // Will be sent as JSON: { "username": "emilys", "password": "emilyspass" }
    const reqObj = {
      username: values.username,
      password: values.password,
    };
    
    setIsLoading(true);
    
    try {
      // Use new authService
      const response = await authService.login(reqObj);
      
      if (response?.accessToken) {
        const {
          accessToken,
          refreshToken,
          firstName,
          lastName,
          username,
        } = response;
        
        // Combine firstName and lastName to create name
        const name = [firstName, lastName].filter(Boolean).join(' ') || '';
        
        dispatch(updateUser({name, username, token: accessToken}));
        setSecureValue(KEYCHAIN_KEYS.TOKEN, accessToken);
        setSecureValue(KEYCHAIN_KEYS.REFRESH_TOKEN, refreshToken || '');
      }
    } catch (e: any) {
      // Handle ApiException errors
      if (e instanceof ApiException) {
        // Handle field-specific errors
        if (e.errors && typeof e.errors === 'object') {
          // Convert Record<string, string[]> to array format for transformToFormikErrors
          const errorsArray = Object.entries(e.errors).flatMap(([param, messages]: [string, string[]]) =>
            messages.map((msg: string) => ({
              location: 'body',
              msg: msg,
              param: param,
            }))
          );
          let result = transformToFormikErrors(errorsArray);
          setErrors(result);
        } 
        // Handle general error message
        else {
          setErrors({
            password: e.message,
          });
        }
      }
      // Handle legacy axios error format (for backward compatibility)
      else if (e.response?.data?.errors) {
        // Check if it's already an array format
        if (Array.isArray(e.response.data.errors)) {
          let result = transformToFormikErrors(e.response.data.errors);
          setErrors(result);
        } else {
          // Convert Record format to array
          const errorsArray = Object.entries(e.response.data.errors).flatMap(([param, messages]: [string, any]) =>
            (Array.isArray(messages) ? messages : [messages]).map((msg: string) => ({
              location: 'body',
              msg: msg,
              param: param,
            }))
          );
          let result = transformToFormikErrors(errorsArray);
          setErrors(result);
        }
      } 
      else if (e.response?.data?.message) {
        setErrors({
          password: e.response.data.message,
        });
      }
      // Handle other errors
      else {
        setErrors({
          password: e.message || 'Login failed. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                    <Input
                      testID="Login.Username"
                      placeholder="Username/Email"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      keyboardType="email-address"
                      error={
                        errors.username && touched.username ? errors.username : ''
                      }
                    />
                    <Input
                      testID="Login.Password"
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                      error={
                        errors.password && touched.password ? errors.password : ''
                      }
                    />
                    <Button
                      title="Login"
                      onPress={() => handleSubmit()}
                      testID="Login.Button"
                    />
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
  },
  formWrapper: {
    width: '90%',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 50,
    height: 50,
  },
});
