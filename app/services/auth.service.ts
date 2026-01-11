/**
 * Auth Service
 * Authentication-related API calls (Business Logic Layer)
 */

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ENDPOINTS, httpService } from '../api';
import type { LoginRequest, LoginResponse } from '../types/auth';

class AuthService {
  /**
   * Login user
   * Supports both JSON and form-urlencoded requests
   */
  async login(credentials: LoginRequest | URLSearchParams): Promise<LoginResponse> {
    // Handle both object and URLSearchParams
    if (credentials instanceof URLSearchParams) {
      const response = await httpService.postFormUrlEncoded<LoginResponse>(
        ENDPOINTS.USER.LOGIN,
        credentials,
        {skipAuth: true},
      );
      return response.data;
    }
    
    const response = await httpService.post<LoginResponse>(
      ENDPOINTS.USER.LOGIN,
      credentials,
      {skipAuth: true},
    );
    return response.data;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<LoginResponse> {
    const response = await httpService.get<LoginResponse>(ENDPOINTS.AUTH.ME);
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{token: string}> {
    const response = await httpService.post<{token: string}>(
      ENDPOINTS.AUTH.REFRESH,
      {refresh_token: refreshToken},
      {skipAuth: true},
    );
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await httpService.post(ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Login with Google OAuth using Firebase Authentication
   * Returns user info from Google and creates a login response
   */
  async loginWithGoogle(): Promise<LoginResponse> {
    try {
      // Check if Google Play Services are available (Android)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Sign in the user
      await GoogleSignin.signIn();
      
      // Get the user's ID token
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error('Failed to get ID token from Google Sign-In');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;

      // Get the ID token for API authentication
      const accessToken = await firebaseUser.getIdToken();

      // Transform Firebase user info to LoginResponse format
      const loginResponse: LoginResponse = {
        id: parseInt(firebaseUser.uid) || undefined,
        username: firebaseUser.email?.split('@')[0] || firebaseUser.email || '',
        email: firebaseUser.email || undefined,
        firstName: firebaseUser.displayName?.split(' ')[0] || undefined,
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || undefined,
        image: firebaseUser.photoURL || undefined,
        accessToken: accessToken,
        token: accessToken,
      };

      return loginResponse;
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Handle specific error cases
      if (error.code === 'sign_in_cancelled') {
        throw new Error('Google sign-in was cancelled');
      } else if (error.code === 'in_progress') {
        throw new Error('Google sign-in is already in progress');
      } else if (error.code === 'play_services_not_available') {
        throw new Error('Google Play Services are not available');
      } else if (error.code === 'DEVELOPER_ERROR' || error.message?.includes('DEVELOPER_ERROR')) {
        // Most common error - SHA-1 fingerprint mismatch
        const errorMessage = 
          'DEVELOPER_ERROR: SHA-1 certificate fingerprint mismatch.\n\n' +
          'To fix:\n' +
          '1. Run: npm run get-sha1\n' +
          '2. Add the SHA-1 to Google Cloud Console:\n' +
          '   - Go to APIs & Services > Credentials\n' +
          '   - Edit your Android OAuth client\n' +
          '   - Add the SHA-1 fingerprint\n' +
          '   - Save and wait 5-10 minutes\n' +
          '3. Rebuild: npm run rebuild:android\n\n' +
          'See README.md for detailed troubleshooting.';
        throw new Error(errorMessage);
      }
      
      throw new Error(error.message || 'Google login failed');
    }
  }
}

export default new AuthService();
