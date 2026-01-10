import {getSecureValue, setSecureValue} from './keyChain';
import { KEYCHAIN_KEYS } from '../types/constants';
/**
 * Request ACCESS TOKEN using REFRESH TOKEN
 * - ONLY request if there is refresh token present
 * - Uses lazy import to avoid circular dependency with store
 */
export const requestNewToken = async () => {
  // 1. Get refresh token from keychain
  getSecureValue(KEYCHAIN_KEYS.REFRESH_TOKEN)
    // 2. Request a new access token
    .then(async rtoken => {
      if (!rtoken) {
        throw new Error('Login Failed');
      }
      // Use lazy import to avoid circular dependency
      const {authService} = await import('../services');
      return authService.login(
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: rtoken,
        }),
      );
    })
    // 3. Parsing new token from response
    .then(response => {
      // Handle both accessToken and token fields
      const acToken = response.accessToken || response.token;
      if (!acToken) {
        throw new Error('No token in response');
      }
      return acToken;
    })
    .then(async acToken => {
      // 4. Save received token to keyring
      setSecureValue(KEYCHAIN_KEYS.TOKEN, acToken);
      // 5. Save received token to redux store (lazy import to avoid circular dependency)
      const {store} = await import('../store/store');
      const {updateToken} = await import('../store/userSlice');
      store.dispatch(updateToken({token: acToken}));
    })
    .catch(err => {
      // Error handled silently - token refresh failed
    });
};
