import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import { useDispatch } from 'react-redux';
import Card from '../../components/Card';
import CustomLoad from '../../components/CustomLoad';
import { Input } from '../../components/Form';
import Layout from '../../components/Layout';
import { login } from '../../services';
import { updateUser } from '../../store/userSlice';
import { transformToFormikErrors } from '../../utils/form';
import { setSecureValue } from '../../utils/keyChain';
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
    // Log form data before submission
    console.log('Form values before submit:', values);
    
    // Create request body object
    // Will be sent as JSON: { "username": "emilys", "password": "emilyspass" }
    const reqObj = {
      username: values.username,
      password: values.password,
    };
    console.log('Request object:', reqObj);
    
    setIsLoading(true);
    
    try {
      // Service request - sends JSON body
      const res = await login(reqObj);
      console.log('Response:', res);

      // API response structure: res.data = { accessToken, refreshToken, firstName, lastName, username, ... }
      console.log('accessToken:', res.data?.accessToken);
      console.log('refreshToken:', res.data?.refreshToken);
      console.log('firstName:', res.data?.firstName);
      console.log('lastName:', res.data?.lastName);
      console.log('username:', res.data?.username);
      console.log('data:', res.data);
      
      if (res.data?.accessToken) {
        const {
          accessToken,
          refreshToken,
          firstName,
          lastName,
          username,
        } = res.data;
        
        // Combine firstName and lastName to create name
        const name = [firstName, lastName].filter(Boolean).join(' ') || '';
        
        dispatch(updateUser({name, username, token: accessToken}));
        setSecureValue('token', accessToken);
        setSecureValue('refresh_token', refreshToken);
      }
    } catch (e: any) {
      
      // Handle field-specific errors (array format)
      if (e.response?.data?.errors) {
        let result = transformToFormikErrors(e.response.data.errors);
        setErrors(result);
      } 
      // Handle general error message (string format)
      else if (e.response?.data?.message) {
        // Display general error on password field since it's a credential error
        setErrors({
          password: e.response.data.message,
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
                // Wrapper function to log data before handleSubmit
                const handleSubmitWithLog = () => {
                  console.log('=== Before handleSubmit ===');
                  console.log('Current form values:', values);
                  console.log('Form errors:', errors);
                  console.log('Touched fields:', touched);
                  console.log('========================');
                  handleSubmit();
                };

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
                      onPress={handleSubmitWithLog}
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
