/**
 * Modal Component
 * Reusable modal/dialog with focus management and accessibility features
 */

import React, { useEffect, useRef, useId } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, title, onClose, children, size = 'md', footer }) => {
  const modalRef = useRef(null);
  const initialFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before the modal opened
    initialFocusRef.current = document.activeElement;

    // Focus the modal wrapper on open
    modalRef.current?.focus();

    // Handle Escape key
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscapeKey);

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = originalOverflow;
      
      // Restore focus to the element that opened the modal
      if (initialFocusRef.current?.focus) {
        initialFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Focus trap: keep focus within modal
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab on first element -> focus last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    }
    // Tab on last element -> focus first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto" role="presentation">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4" role="presentation">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id={titleId} className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Close dialog"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
