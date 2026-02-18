/**
 * Language Context — EN / Tamil (தமிழ்)
 * Provides: language, changeLanguage, t(), isTamil, isEnglish
 * Persists selection to localStorage key 'apt_language'
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from './translations';

const LanguageContext = createContext(null);

const getNestedValue = (obj, key) => {
  return key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('apt_language') || 'en'
  );

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('apt_language', lang);
  }, []);

  /**
   * t('section.key') — look up translation with English fallback
   */
  const t = useCallback(
    (key) => {
      const val = getNestedValue(translations[language], key);
      if (val !== undefined) return val;
      // Fallback to English
      const fallback = getNestedValue(translations.en, key);
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isTamil: language === 'ta',
        isEnglish: language === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};

export default LanguageContext;
