/**
 * Authentication Types
 * Type definitions for authentication-related components and services
 */

export interface ValuesType {
  username: string;
  password: string;
}

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

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
