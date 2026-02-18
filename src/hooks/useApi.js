/**
 * Custom Hooks
 * useApi, useForm, usePagination hooks
 */

import { useState, useCallback, useEffect } from 'react';
import logger from '../utils/logger';
import errorHandler from '../utils/errorHandler';

/**
 * useApi Hook
 * Handle API calls with loading and error states
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const handledError = errorHandler.handleError(err);
        setError(handledError);
        logger.error('API Error', handledError);
        throw handledError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, loading, error, execute };
};

/**
 * useForm Hook
 * Handle form state and validation
 */
export const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } catch (error) {
        logger.error('Form submit error', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
    setValues,
  };
};

/**
 * useFetch Hook
 * Auto-fetch data on component mount with optional demo data fallback
 */
export const useFetch = (apiFunction, demoDataFunction = null, dependencies = []) => {
  const [usedDemoData, setUsedDemoData] = useState(false);
  const { data, loading, error, execute } = useApi(apiFunction, dependencies);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await execute();
      } catch (err) {
        // If API fails and demo data available, use it
        if (demoDataFunction) {
          logger.warn('API fetch failed, using demo data');
          setUsedDemoData(true);
        }
      }
    };
    fetchData();
  }, dependencies);

  // Return demo data if API failed and demo function provided
  if (usedDemoData && demoDataFunction) {
    return { data: demoDataFunction, loading: false, error: null, refetch: execute, isDemo: true };
  }

  return { data, loading, error, refetch: execute, isDemo: false };
};

/**
 * useAsync Hook
 * Generic async operations handler
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    try {
      const response = await asyncFunction(...args);
      setResult(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, result, error };
};
