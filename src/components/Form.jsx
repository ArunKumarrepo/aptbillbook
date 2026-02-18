/**
 * Form Components
 * Reusable form input components with validation and accessibility
 */

import React from 'react';

export const FormGroup = ({ label, required = false, error, children, helpText }) => {
  const inputId = React.useId();
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      {React.cloneElement(children, { id: inputId, 'aria-describedby': error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined })}
      {error && <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500" role="alert">{error}</p>}
      {helpText && !error && <p id={`${inputId}-help`} className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};

export const Input = React.forwardRef(
  (
    {
      type = 'text',
      label,
      placeholder,
      required = false,
      error,
      helpText,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <FormGroup label={label} required={required} error={error} helpText={helpText}>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        />
      </FormGroup>
    );
  }
);

Input.displayName = 'Input';

export const Select = React.forwardRef(
  ({ 
    label, 
    options = [], 
    required = false, 
    error, 
    placeholder,
    disabled = false,
    helpText,
    ...props 
  }, ref) => {
    return (
      <FormGroup label={label} required={required} error={error} helpText={helpText}>
        <select
          ref={ref}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {Array.isArray(options) && options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      </FormGroup>
    );
  }
);

Select.displayName = 'Select';

export const Textarea = React.forwardRef(
  ({ 
    label, 
    placeholder, 
    required = false, 
    error, 
    rows = 4,
    disabled = false,
    helpText,
    ...props 
  }, ref) => {
    return (
      <FormGroup label={label} required={required} error={error} helpText={helpText}>
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        />
      </FormGroup>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
        disabled || loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
};

export const Form = ({ children, onSubmit, className = '', onReset }) => {
  const handleSubmit = (e) => {
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} onReset={onReset} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};
