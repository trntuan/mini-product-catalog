/**
 * Auth Service
 * Authentication-related API calls (Business Logic Layer)
 */

import {httpService, ENDPOINTS} from '../api';

// Types
export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string;
  refresh_token?: string;
}

export interface LoginResponse {
  id?: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  token?: string;
  accessToken?: string; // Some APIs use accessToken
  refreshToken?: string; // Some APIs use refreshToken
}

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
}

export default new AuthService();
