/**
 * Auth Service (Template)
 * Template for authentication service integration
 * To be implemented when Auth is integrated with C# API
 */

import apiService from './apiService';
import logger from '../utils/logger';

const authService = {
  /**
   * Login with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - { token, user }
   */
  login: async (email, password) => {
    try {
      const response = await apiService.post('/auth/login', {
        email,
        password,
      });
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        apiService.setAuthToken(response.token);
        logger.info('User logged in', { email });
      }
      
      return response;
    } catch (error) {
      logger.error('Login failed', { email });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    apiService.setAuthToken(null);
    logger.info('User logged out');
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await apiService.post('/auth/register', userData);
      logger.info('User registered', { email: userData.email });
      return response;
    } catch (error) {
      logger.error('Registration failed');
      throw error;
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    try {
      const response = await apiService.get('/auth/me');
      return response;
    } catch (error) {
      logger.error('Failed to get current user');
      throw error;
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    try {
      const response = await apiService.post('/auth/refresh', {});
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        apiService.setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      logger.error('Token refresh failed');
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await apiService.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      logger.info('Password changed');
      return response;
    } catch (error) {
      logger.error('Password change failed');
      throw error;
    }
  },

  /**
   * Initialize auth on app load
   */
  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiService.setAuthToken(token);
      logger.debug('Auth token restored');
    }
  },
};

export default authService;
