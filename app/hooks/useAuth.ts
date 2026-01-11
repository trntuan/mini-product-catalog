/**
 * Custom hook for managing authentication logic
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ApiException } from '../api';
import { authService } from '../services';
import { updateUser } from '../store/userSlice';
import { KEYCHAIN_KEYS } from '../types/constants';
import type { ValuesType } from '../types/auth';
import { transformToFormikErrors } from '../utils/form';
import { setSecureValue } from '../utils/keyChain';

export function useAuth() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const response = await authService.loginWithGoogle();
      
      if (response?.accessToken || response?.token) {
        const {
          accessToken,
          token,
          firstName,
          lastName,
          username,
          email,
        } = response;
        
        // Use accessToken or token, whichever is available
        const authToken = accessToken || token || '';
        
        // Combine firstName and lastName to create name, fallback to username or email
        const name = [firstName, lastName].filter(Boolean).join(' ') || username || email || '';
        
        dispatch(updateUser({name, username: username || email || '', token: authToken}));
        setSecureValue(KEYCHAIN_KEYS.TOKEN, authToken);
        // Google OAuth doesn't provide refresh token in this flow, but we can store empty string
        setSecureValue(KEYCHAIN_KEYS.REFRESH_TOKEN, '');
      }
    } catch (e: any) {
      console.error('Google login error:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (values: ValuesType, {setErrors}: any) => {
    // Create request body object
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

  return {
    isLoading,
    handleLogin,
    handleGoogleLogin,
  };
}
