/**
 * Hook to restore user data on app initialization
 * Checks for existing token and restores user info if available
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '../services';
import { updateUser } from '../store/userSlice';
import { KEYCHAIN_KEYS } from '../../constants/app';
import { getSecureValue } from '../utils/keyChain';

export function useRestoreUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreUserData = async () => {
      try {
        // Check if token exists in keychain
        const token = await getSecureValue(KEYCHAIN_KEYS.TOKEN);
        
        if (token) {
          // Try to get current user info from API
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
            // If getCurrentUser fails, user might not be logged in or token is invalid
            // Silently fail - user will need to login again
            console.log('Could not restore user data from API:', error);
          }
        }
      } catch (error) {
        console.error('Error restoring user data:', error);
      }
    };

    restoreUserData();
  }, [dispatch]);
}
