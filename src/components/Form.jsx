/**
 * Form Components
 * Reusable form input components
 */

import React from 'react';

export const FormGroup = ({ label, required = false, error, children }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
      ...props
    },
    ref
  ) => {
    return (
      <FormGroup label={label} required={required} error={error}>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
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
  ({ label, options, required = false, error, placeholder, ...props }, ref) => {
    return (
      <FormGroup label={label} required={required} error={error}>
        <select
          ref={ref}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormGroup>
    );
  }
);

Select.displayName = 'Select';

export const Textarea = React.forwardRef(
  ({ label, placeholder, required = false, error, rows = 4, ...props }, ref) => {
    return (
      <FormGroup label={label} required={required} error={error}>
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
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
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '⏳' : children}
    </button>
  );
};

export const Form = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};
