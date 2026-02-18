/**
 * Alert Component
 * Reusable alert/notification component
 */

import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', title, message, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '✓',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '✕',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '!',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'i',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 flex items-start gap-4`}
      role="alert"
    >
      <div className={`${config.iconColor} text-xl font-bold flex-shrink-0`}>
        {config.icon}
      </div>
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${config.titleColor}`}>{title}</h3>}
        {message && <p className={config.textColor}>{message}</p>}
      </div>
      {autoClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className={`${config.textColor} hover:opacity-70 flex-shrink-0`}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
