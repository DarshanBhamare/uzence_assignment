import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const ModalContent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prev || 'unset';
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={
          'relative z-10 w-full ' + sizeClasses[size] + ' max-h-[90vh] overflow-hidden ' + className
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl shadow-modal animate-slide-up overflow-hidden">
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h3 id="modal-title" className="text-lg font-semibold text-neutral-800">
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const Modal: React.FC<ModalProps> = (props) => {
  if (typeof window === 'undefined') return null;
  return createPortal(<ModalContent {...props} />, document.body);
};
