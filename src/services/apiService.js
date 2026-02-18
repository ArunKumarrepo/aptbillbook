/**
 * API Service
 * Centralized HTTP client for all API calls
 */

import config from '../utils/config';
import logger from '../utils/logger';
import errorHandler from '../utils/errorHandler';

class APIService {
  constructor() {
    this.baseURL = config.api.baseURL;
    this.timeout = config.api.timeout;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  async request(method, endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: this.headers,
      timeout: this.timeout,
    };

    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    if (options.data) {
      config.body = JSON.stringify(options.data);
    }

    try {
      logger.debug(`API Request: ${method} ${endpoint}`, options.params || options.data);

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || 'API request failed');
        error.response = { status: response.status, data };
        throw error;
      }

      logger.debug(`API Response: ${method} ${endpoint}`, data);
      return data;
    } catch (error) {
      const handledError = errorHandler.handleError(error, { endpoint, method });
      throw handledError;
    }
  }

  get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, { data, ...options });
  }

  put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, { data, ...options });
  }

  patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, { data, ...options });
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }
}

export default new APIService();
