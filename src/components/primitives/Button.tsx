import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-card hover:shadow-card-hover',
  secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 shadow-sm hover:shadow-md',
  danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-card hover:shadow-card-hover',
  ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-800',
  outline: 'border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-semibold
        rounded-full
        transition-all
        duration-150
        ease-out
        focus-visible:ring-2
        focus-visible:ring-primary-500
        focus-visible:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
